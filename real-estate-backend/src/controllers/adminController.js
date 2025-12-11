const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Favorite = require('../models/Favorite');
const Review = require('../models/Review');
const { sendEmail } = require('../utils/emailService');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalAgents,
      totalAdmins,
      totalProperties,
      activeProperties,
      pendingProperties,
      totalInquiries,
      newInquiries,
      totalFavorites,
      totalReviews
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'agent', isActive: true }),
      User.countDocuments({ role: 'admin' }),
      Property.countDocuments(),
      Property.countDocuments({ status: 'approved', isActive: true }),
      Property.countDocuments({ status: 'pending' }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Favorite.countDocuments(),
      Review.countDocuments()
    ]);

    // Get revenue stats (for premium features)
    const revenueStats = await Property.aggregate([
      { $match: { status: { $in: ['sold', 'rented'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price' },
          totalSales: { $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] } },
          totalRentals: { $sum: { $cond: [{ $eq: ['$status', 'rented'] }, 1, 0] } }
        }
      }
    ]);

    // Get recent activities
    const recentProperties = await Property.find()
      .populate('agent', 'name email company')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          users: { total: totalUsers, agents: totalAgents, admins: totalAdmins },
          properties: { total: totalProperties, active: activeProperties, pending: pendingProperties },
          engagements: { inquiries: totalInquiries, newInquiries, favorites: totalFavorites, reviews: totalReviews },
          revenue: revenueStats[0] || { totalRevenue: 0, totalSales: 0, totalRentals: 0 }
        },
        recentActivities: {
          properties: recentProperties,
          users: recentUsers
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system statistics
// @route   GET /api/admin/system/stats
// @access  Private (Admin)
const getSystemStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      newUsers,
      newProperties,
      newInquiries,
      activeAgents,
      inactiveUsers
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Property.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Inquiry.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ role: 'agent', isActive: true }),
      User.countDocuments({ isActive: false })
    ]);

    // Get property status distribution
    const propertyStatusStats = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user role distribution
    const userRoleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        period: 'last_30_days',
        growth: {
          users: newUsers,
          properties: newProperties,
          inquiries: newInquiries
        },
        distributions: {
          properties: propertyStatusStats,
          users: userRoleStats
        },
        counts: {
          activeAgents,
          inactiveUsers
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's properties and inquiries
    const [properties, inquiries] = await Promise.all([
      Property.find({ agent: user._id }),
      Inquiry.find({ user: user._id }).populate('property', 'title')
    ]);

    res.json({
      success: true,
      data: {
        user,
        stats: {
          properties: properties.length,
          inquiries: inquiries.length,
          activeProperties: properties.filter(p => p.status === 'approved' && p.isActive).length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send notification email for role change
    try {
      await sendEmail({
        email: user.email,
        subject: 'Account Role Updated - RealEstate Pro',
        template: 'roleUpdated',
        data: {
          name: user.name,
          newRole: role,
          timestamp: new Date().toLocaleString()
        }
      });
    } catch (emailError) {
      console.log('Role update notification email failed:', emailError);
    }

    res.json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send notification email
    try {
      await sendEmail({
        email: user.email,
        subject: isActive ? 'Account Reactivated - RealEstate Pro' : 'Account Deactivated - RealEstate Pro',
        template: isActive ? 'accountReactivated' : 'accountDeactivated',
        data: {
          name: user.name,
          reason: reason || 'Administrative decision',
          timestamp: new Date().toLocaleString(),
          contactEmail: 'support@realestatepro.com'
        }
      });
    } catch (emailError) {
      console.log('Status update notification email failed:', emailError);
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete all user-related data
    await Promise.all([
      Property.deleteMany({ agent: user._id }),
      Inquiry.deleteMany({ $or: [{ user: user._id }, { agent: user._id }] }),
      Favorite.deleteMany({ user: user._id }),
      Review.deleteMany({ $or: [{ user: user._id }, { agent: user._id }] }),
      User.findByIdAndDelete(user._id)
    ]);

    res.json({
      success: true,
      message: 'User and all associated data deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending agent applications
// @route   GET /api/admin/agents/applications
// @access  Private (Admin)
const getAgentApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const agents = await User.find({
      role: 'agent',
      isActive: false,
      company: { $exists: true, $ne: '' },
      licenseNumber: { $exists: true, $ne: '' }
    })
    .select('-password')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

    const total = await User.countDocuments({
      role: 'agent',
      isActive: false,
      company: { $exists: true, $ne: '' },
      licenseNumber: { $exists: true, $ne: '' }
    });

    res.json({
      success: true,
      data: {
        agents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve agent application
// @route   PUT /api/admin/agents/:id/approve
// @access  Private (Admin)
const approveAgentApplication = async (req, res, next) => {
  try {
    const agent = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true, runValidators: true }
    ).select('-password');

    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({
        success: false,
        message: 'Agent application not found'
      });
    }

    // Send approval email
    try {
      await sendEmail({
        email: agent.email,
        subject: 'Agent Application Approved - RealEstate Pro',
        template: 'agentApproved',
        data: {
          name: agent.name,
          company: agent.company,
          dashboardUrl: `${req.protocol}://${req.get('host')}/agent/dashboard`
        }
      });
    } catch (emailError) {
      console.log('Agent approval email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Agent application approved successfully',
      data: { agent }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject agent application
// @route   PUT /api/admin/agents/:id/reject
// @access  Private (Admin)
const rejectAgentApplication = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const agent = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'user', company: null, licenseNumber: null, experience: null, specializations: [] },
      { new: true, runValidators: true }
    ).select('-password');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent application not found'
      });
    }

    // Send rejection email
    try {
      await sendEmail({
        email: agent.email,
        subject: 'Agent Application Update - RealEstate Pro',
        template: 'agentRejected',
        data: {
          name: agent.name,
          reason: reason || 'We were unable to approve your application at this time.',
          contactEmail: 'support@realestatepro.com'
        }
      });
    } catch (emailError) {
      console.log('Agent rejection email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Agent application rejected successfully',
      data: { agent }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending properties
// @route   GET /api/admin/properties/pending
// @access  Private (Admin)
const getPendingProperties = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, type } = req.query;

    const query = { status: 'pending' };
    if (category) query.category = category;
    if (type) query.type = type;

    const properties = await Property.find(query)
      .populate('agent', 'name email company phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property status
// @route   PUT /api/admin/properties/:id/status
// @access  Private (Admin)
const updatePropertyStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason, adminNotes } = req.body;

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'rejected' && { rejectionReason }),
        ...(adminNotes && { adminNotes })
      },
      { new: true, runValidators: true }
    ).populate('agent', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Send notification to agent
    try {
      await sendEmail({
        email: property.agent.email,
        subject: `Property ${status.charAt(0).toUpperCase() + status.slice(1)} - RealEstate Pro`,
        template: status === 'approved' ? 'propertyApproved' : 'propertyRejected',
        data: {
          agentName: property.agent.name,
          propertyTitle: property.title,
          status: status,
          ...(status === 'rejected' && { reason: rejectionReason }),
          propertyUrl: `${req.protocol}://${req.get('host')}/properties/${property._id}`
        }
      });
    } catch (emailError) {
      console.log('Property status notification email failed:', emailError);
    }

    res.json({
      success: true,
      message: `Property ${status} successfully`,
      data: { property }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property featured status
// @route   PUT /api/admin/properties/:id/featured
// @access  Private (Admin)
const togglePropertyFeatured = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property.isFeatured = !property.isFeatured;
    await property.save();

    res.json({
      success: true,
      message: `Property ${property.isFeatured ? 'added to' : 'removed from'} featured listings`,
      data: { property }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/admin/properties/:id
// @access  Private (Admin)
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Delete related data
    await Promise.all([
      Inquiry.deleteMany({ property: property._id }),
      Favorite.deleteMany({ property: property._id }),
      Property.findByIdAndDelete(property._id)
    ]);

    res.json({
      success: true,
      message: 'Property and all associated data deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update properties
// @route   POST /api/admin/properties/bulk-update
// @access  Private (Admin)
const bulkUpdateProperties = async (req, res, next) => {
  try {
    const { propertyIds, updates } = req.body;

    const result = await Property.updateMany(
      { _id: { $in: propertyIds } },
      { $set: updates }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} properties updated successfully`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inquiry statistics
// @route   GET /api/admin/inquiries/stats
// @access  Private (Admin)
const getInquiryStats = async (req, res, next) => {
  try {
    const inquiryStats = await Inquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalInquiries = await Inquiry.countDocuments();
    const recentInquiries = await Inquiry.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      data: {
        totalInquiries,
        recentInquiries,
        byStatus: inquiryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activities
// @route   GET /api/admin/recent-activities
// @access  Private (Admin)
const getRecentActivities = async (req, res, next) => {
  try {
    const [recentUsers, recentProperties, recentInquiries] = await Promise.all([
      User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(10),
      Property.find().populate('agent', 'name').sort({ createdAt: -1 }).limit(10),
      Inquiry.find().populate('user', 'name').populate('property', 'title').sort({ createdAt: -1 }).limit(10)
    ]);

    res.json({
      success: true,
      data: {
        users: recentUsers,
        properties: recentProperties,
        inquiries: recentInquiries
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send announcement
// @route   POST /api/admin/announcements
// @access  Private (Admin)
const sendAnnouncement = async (req, res, next) => {
  try {
    const { title, message, type, targetUsers, specificUsers, isImportant } = req.body;

    // This would typically integrate with a notification system
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Announcement scheduled for delivery',
      data: {
        announcement: {
          title,
          type,
          targetUsers,
          isImportant,
          scheduledAt: new Date()
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getSystemStats,
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAgentApplications,
  approveAgentApplication,
  rejectAgentApplication,
  getPendingProperties,
  updatePropertyStatus,
  togglePropertyFeatured,
  deleteProperty,
  bulkUpdateProperties,
  getInquiryStats,
  getRecentActivities,
  sendAnnouncement
};