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
          address: user.address,
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
    const { name, phone, address, bio, website, socialMedia } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        address,
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
          address: user.address,
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
    const { company, licenseNumber, experience, specializations, bio, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        company,
        licenseNumber,
        experience,
        specializations,
        bio,
        address
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
          address: user.address,
          profileCompletion: user.profileCompletion,
          agentStats: user.agentStats
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user location
// @route   PUT /api/users/update-location
// @access  Private
const updateLocation = async (req, res, next) => {
  try {
    const { street, city, state, country, postalCode, coordinates } = req.body;

    if (!city || !state || !country) {
      return res.status(400).json({
        success: false,
        message: 'City, state, and country are required'
      });
    }

    const updateData = {
      address: {
        street,
        city,
        state,
        country,
        postalCode,
        coordinates
      }
    };

    Object.keys(updateData.address).forEach(key => {
      if (updateData.address[key] === undefined) {
        delete updateData.address[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        address: user.address,
        formattedAddress: user.getFormattedAddress(),
        profileCompletion: user.profileCompletion,
        hasCompleteLocation: user.hasCompleteLocation()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/update-preferences
// @access  Private
const updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences },
      { new: true, runValidators: true }
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

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

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
    const { company, licenseNumber, phone, experience, specializations, address } = req.body;

    const user = await User.findById(req.user.id);

    if (user.role === 'agent') {
      return res.status(400).json({
        success: false,
        message: 'User is already an agent'
      });
    }

    user.role = 'agent';
    user.company = company;
    user.licenseNumber = licenseNumber;
    user.phone = phone;
    user.experience = experience;
    user.specializations = specializations;
    if (address) user.address = address;
    user.isActive = false;

    await user.save();

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
          address: user.address,
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

      const viewsResult = await Property.aggregate([
        { $match: { agent: req.user._id } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]);

      const propertiesByCity = await Property.aggregate([
        { $match: { agent: req.user._id } },
        { $group: { 
          _id: '$location.city', 
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }},
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      stats = {
        totalProperties,
        activeProperties,
        pendingProperties,
        soldRentedProperties,
        totalInquiries,
        newInquiries,
        totalViews: viewsResult[0]?.totalViews || 0,
        totalFavorites: await Favorite.countDocuments({ user: req.user.id }),
        locationInsights: {
          propertiesByCity
        }
      };
    } else {
      const favoritesCount = await Favorite.countDocuments({ user: req.user.id });
      const inquiriesCount = await Inquiry.countDocuments({ user: req.user.id });
      const scheduledVisits = await Inquiry.countDocuments({
        user: req.user.id,
        visitScheduled: true
      });

      const favoriteLocations = await Favorite.aggregate([
        { $match: { user: req.user._id } },
        { $lookup: {
          from: 'properties',
          localField: 'property',
          foreignField: '_id',
          as: 'property'
        }},
        { $unwind: '$property' },
        { $group: {
          _id: '$property.location.city',
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } },
        { $limit: 3 }
      ]);

      stats = {
        favoritesCount,
        inquiriesCount,
        scheduledVisits,
        propertiesViewed: 0,
        locationPreferences: {
          favoriteAreas: favoriteLocations
        }
      };
    }

    res.json({
      success: true,
      data: { 
        stats
      }
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
    await user.updateAgentStats();

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

    const activeProperties = await Property.countDocuments({
      agent: agent._id,
      status: 'approved',
      isActive: true
    });

    const agentProperties = await Property.find({
      agent: agent._id,
      'location.city': agent.address?.city,
      status: 'approved',
      isActive: true
    })
    .select('title price type category location images specifications')
    .limit(6);

    res.json({
      success: true,
      data: {
        agent: {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          avatar: agent.avatar,
          company: agent.company,
          licenseNumber: agent.licenseNumber,
          experience: agent.experience,
          specializations: agent.specializations,
          bio: agent.bio,
          website: agent.website,
          socialMedia: agent.socialMedia,
          address: agent.address,
          formattedAddress: agent.getFormattedAddress(),
          agentStats: agent.agentStats,
          profileCompletion: agent.profileCompletion
        },
        activeProperties,
        featuredProperties: agentProperties
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agents by location
// @route   GET /api/users/agents/location
// @access  Public
const getAgentsByLocation = async (req, res, next) => {
  try {
    const { city, state, page = 1, limit = 12 } = req.query;
    
    const agents = await User.findAgentsByLocation(city, state)
      .select('name email phone company experience specializations avatar address agentStats bio')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'agentStats.rating': -1, experience: -1 });

    const total = await User.countDocuments({ 
      role: 'agent', 
      isActive: true,
      ...(city && { 'address.city': new RegExp(city, 'i') }),
      ...(state && { 'address.state': new RegExp(state, 'i') })
    });

    const formattedAgents = agents.map(agent => ({
      id: agent._id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      company: agent.company,
      experience: agent.experience,
      specializations: agent.specializations,
      bio: agent.bio,
      avatar: agent.avatar,
      address: {
        city: agent.address?.city,
        state: agent.address?.state,
        country: agent.address?.country,
        formatted: agent.getFormattedAddress()
      },
      stats: {
        rating: agent.agentStats.rating,
        totalProperties: agent.agentStats.totalProperties,
        soldProperties: agent.agentStats.soldProperties,
        reviewsCount: agent.agentStats.reviewsCount
      },
      profileCompletion: agent.profileCompletion
    }));

    res.json({
      success: true,
      data: {
        agents: formattedAgents,
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



module.exports = {
  getProfile,
  updateProfile,
  updateAgentProfile,
  updateLocation,
  updatePreferences,
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
  getAgentsByLocation,
  getAgentReviews,
  submitAgentReview
  
};