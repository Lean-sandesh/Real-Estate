const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Favorite = require('../models/Favorite');
const Review = require('../models/Review');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../utils/emailService');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          company: user.company,
          licenseNumber: user.licenseNumber,
          bio: user.bio,
          website: user.website,
          socialMedia: user.socialMedia,
          experience: user.experience,
          specializations: user.specializations,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive,
          profileCompletion: user.profileCompletion,
          preferences: user.preferences,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, website, socialMedia } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        bio,
        website,
        socialMedia
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          bio: user.bio,
          website: user.website,
          socialMedia: user.socialMedia,
          profileCompletion: user.profileCompletion
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update agent profile
// @route   PUT /api/users/profile/agent
// @access  Private/Agent
const updateAgentProfile = async (req, res, next) => {
  try {
    const { company, licenseNumber, experience, specializations, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        company,
        licenseNumber,
        experience,
        specializations,
        bio
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      message: 'Agent profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          company: user.company,
          licenseNumber: user.licenseNumber,
          experience: user.experience,
          specializations: user.specializations,
          bio: user.bio,
          profileCompletion: user.profileCompletion,
          agentStats: user.agentStats
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user avatar
// @route   POST /api/users/profile/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: {
          public_id: req.file.public_id,
          url: req.file.path
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user avatar
// @route   DELETE /api/users/profile/avatar
// @access  Private
const deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: {
          public_id: null,
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567/default-avatar.png'
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Avatar removed successfully',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    // Send password change notification email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Changed - RealEstate Pro',
        template: 'passwordChanged',
        data: {
          name: user.name,
          timestamp: new Date().toLocaleString()
        }
      });
    } catch (emailError) {
      console.log('Password change notification email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Password changed successfully',
      data: {
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Become an agent
// @route   POST /api/users/become-agent
// @access  Private
const becomeAgent = async (req, res, next) => {
  try {
    const { company, licenseNumber, phone, experience, specializations } = req.body;

    const user = await User.findById(req.user.id);

    if (user.role === 'agent') {
      return res.status(400).json({
        success: false,
        message: 'User is already an agent'
      });
    }

    // Update user to agent role with additional info
    user.role = 'agent';
    user.company = company;
    user.licenseNumber = licenseNumber;
    user.phone = phone;
    user.experience = experience;
    user.specializations = specializations;
    user.isActive = false; // Require admin approval for new agents

    await user.save();

    // Notify admin about new agent registration
    try {
      const adminUsers = await User.find({ role: 'admin', isActive: true });
      for (const admin of adminUsers) {
        await sendEmail({
          email: admin.email,
          subject: 'New Agent Registration - RealEstate Pro',
          template: 'newAgentRegistration',
          data: {
            agentName: user.name,
            agentEmail: user.email,
            company: user.company,
            licenseNumber: user.licenseNumber,
            adminUrl: `${req.protocol}://${req.get('host')}/admin/users`
          }
        });
      }
    } catch (emailError) {
      console.log('Admin notification email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Agent registration submitted successfully. Please wait for admin approval.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          licenseNumber: user.licenseNumber,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate('property')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        favorites,
        count: favorites.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add property to favorites
// @route   POST /api/users/favorites/:propertyId
// @access  Private
const addToFavorites = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      property: req.params.propertyId
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Property already in favorites'
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      property: req.params.propertyId
    });

    await favorite.populate('property');

    res.status(201).json({
      success: true,
      message: 'Property added to favorites',
      data: { favorite }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/users/favorites/:propertyId
// @access  Private
const removeFromFavorites = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      property: req.params.propertyId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      message: 'Property removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    let stats = {};

    if (req.user.role === 'agent' || req.user.role === 'admin') {
      // Agent/Admin stats
      const totalProperties = await Property.countDocuments({ agent: req.user.id });
      const activeProperties = await Property.countDocuments({ 
        agent: req.user.id, 
        status: 'approved',
        isActive: true 
      });
      const pendingProperties = await Property.countDocuments({ 
        agent: req.user.id, 
        status: 'pending' 
      });
      const soldRentedProperties = await Property.countDocuments({
        agent: req.user.id,
        status: { $in: ['sold', 'rented'] }
      });

      const totalInquiries = await Inquiry.countDocuments({ 
        agent: req.user.id 
      });
      const newInquiries = await Inquiry.countDocuments({
        agent: req.user.id,
        status: 'new'
      });

      // Get total views from properties
      const viewsResult = await Property.aggregate([
        { $match: { agent: req.user._id } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]);

      stats = {
        totalProperties,
        activeProperties,
        pendingProperties,
        soldRentedProperties,
        totalInquiries,
        newInquiries,
        totalViews: viewsResult[0]?.totalViews || 0,
        totalFavorites: await Favorite.countDocuments({ user: req.user.id })
      };
    } else {
      // Regular user stats
      const favoritesCount = await Favorite.countDocuments({ user: req.user.id });
      const inquiriesCount = await Inquiry.countDocuments({ user: req.user.id });
      const scheduledVisits = await Inquiry.countDocuments({
        user: req.user.id,
        visitScheduled: true
      });

      stats = {
        favoritesCount,
        inquiriesCount,
        scheduledVisits,
        propertiesViewed: 0 // Would need to track view history
      };
    }

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent statistics
// @route   GET /api/users/dashboard/agent-stats
// @access  Private/Agent
const getAgentStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    await user.updateAgentStats(); // Update stats

    // Get recent performance data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProperties = await Property.countDocuments({
      agent: req.user.id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const recentInquiries = await Inquiry.countDocuments({
      agent: req.user.id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const performanceStats = {
      recentProperties,
      recentInquiries,
      conversionRate: recentInquiries > 0 ? (recentProperties / recentInquiries * 100).toFixed(2) : 0
    };

    res.json({
      success: true,
      data: {
        agentStats: user.agentStats,
        performanceStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's properties
// @route   GET /api/users/dashboard/my-properties
// @access  Private/Agent
const getMyProperties = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { agent: req.user.id };
    if (status) query.status = status;

    const properties = await Property.find(query)
      .populate('inquiries')
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

// @desc    Get user's inquiries
// @route   GET /api/users/dashboard/my-inquiries
// @access  Private
const getMyInquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    let query = {};
    if (req.user.role === 'user') {
      query.user = req.user.id;
    } else if (req.user.role === 'agent' || req.user.role === 'admin') {
      query.agent = req.user.id;
    }

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title price images location')
      .populate('user', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Inquiry.countDocuments(query);

    res.json({
      success: true,
      data: {
        inquiries,
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

// @desc    Get agent public profile
// @route   GET /api/users/profile/agent/:id
// @access  Public
const getAgentProfile = async (req, res, next) => {
  try {
    const agent = await User.findOne({
      _id: req.params.id,
      role: 'agent',
      isActive: true
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Get agent's active properties count
    const activeProperties = await Property.countDocuments({
      agent: agent._id,
      status: 'approved',
      isActive: true
    });

    res.json({
      success: true,
      data: {
        agent: agent.getPublicProfile(),
        activeProperties
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent reviews
// @route   GET /api/users/profile/agent/:id/reviews
// @access  Public
const getAgentReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ agent: req.params.id })
      .populate('user', 'name avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ agent: req.params.id });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { agent: req.params.id } },
      {
        $group: {
          _id: '$agent',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        ratingStats: ratingStats[0] || { averageRating: 0, totalReviews: 0 },
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

// @desc    Submit agent review
// @route   POST /api/users/reviews/agent/:agentId
// @access  Private
const submitAgentReview = async (req, res, next) => {
  try {
    const { rating, comment, transactionType } = req.body;

    const agent = await User.findOne({
      _id: req.params.agentId,
      role: 'agent',
      isActive: true
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Check if user already reviewed this agent
    const existingReview = await Review.findOne({
      user: req.user.id,
      agent: req.params.agentId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this agent'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      agent: req.params.agentId,
      rating,
      comment,
      transactionType
    });

    await review.populate('user', 'name avatar');

    // Update agent stats
    await agent.updateAgentStats();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateAgentProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  becomeAgent,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getDashboardStats,
  getAgentStats,
  getMyProperties,
  getMyInquiries,
  getAgentProfile,
  getAgentReviews,
  submitAgentReview,
  updatePreferences
};