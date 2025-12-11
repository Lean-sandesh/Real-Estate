const Property = require('../models/Property');
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Inquiry = require('../models/Inquiry');
const APIFeatures = require('../utils/apiFeatures');
const { sendEmail } = require('../utils/emailService');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    // Base query for active, approved properties
    const baseQuery = { 
      status: 'approved', 
      isActive: true,
      expiresAt: { $gt: new Date() }
    };

    const features = new APIFeatures(
      Property.find(baseQuery)
        .populate('agent', 'name email phone avatar company')
        .populate('favorites')
        .populate('reviews'),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const properties = await features.query;

    // Get total count for pagination
    const total = await Property.countDocuments(baseQuery);

    res.json({
      success: true,
      count: properties.length,
      total,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 10))
      },
      data: { properties }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name email phone avatar company experience specializations agentStats')
      .populate({
        path: 'favorites',
        populate: { path: 'user', select: 'name' }
      })
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar' }
      });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

    // Check if user has favorited this property
    let isFavorited = false;
    if (req.user) {
      const favorite = await Favorite.findOne({
        user: req.user.id,
        property: property._id
      });
      isFavorited = !!favorite;
    }

    res.json({
      success: true,
      data: { 
        property: {
          ...property.toObject(),
          isFavorited
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private (Agent/Admin)
const createProperty = async (req, res, next) => {
  try {
    req.body.agent = req.user.id;
    
    // Set default status based on user role
    if (req.user.role === 'admin') {
      req.body.status = 'approved';
    } else {
      req.body.status = 'pending';
    }

    const property = await Property.create(req.body);

    await property.populate('agent', 'name email company');

    // Send notification for pending approval
    if (property.status === 'pending') {
      try {
        const adminUsers = await User.find({ role: 'admin', isActive: true });
        for (const admin of adminUsers) {
          await sendEmail({
            email: admin.email,
            subject: 'New Property Pending Approval - RealEstate Pro',
            template: 'propertyPending',
            data: {
              adminName: admin.name,
              propertyTitle: property.title,
              agentName: property.agent.name,
              agentCompany: property.agent.company,
              adminUrl: `${req.protocol}://${req.get('host')}/admin/properties/pending`
            }
          });
        }
      } catch (emailError) {
        console.log('Admin notification email failed:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: property.status === 'approved' 
        ? 'Property created successfully' 
        : 'Property created successfully and submitted for approval',
      data: { property }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Agent/Admin)
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check authorization
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    // If non-admin is updating approved property, reset status to pending for review
    if (req.user.role !== 'admin' && property.status === 'approved') {
      req.body.status = 'pending';
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('agent', 'name email company');

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: { property }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Agent/Admin)
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
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

// @desc    Get user properties
// @route   GET /api/properties/my-properties
// @access  Private (Agent/Admin)
const getMyProperties = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { agent: req.user.id };
    if (status) query.status = status;

    const properties = await Property.find(query)
      .populate('favorites')
      .populate('inquiries')
      .populate('reviews')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);

    // Get property statistics
    const stats = await Property.aggregate([
      { $match: { agent: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        properties,
        stats,
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

// @desc    Upload property images
// @route   POST /api/properties/:id/images
// @access  Private (Agent/Admin)
const uploadPropertyImages = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload images for this property'
      });
    }

    const newImages = req.files.map(file => ({
      public_id: file.public_id || file.filename,
      url: file.path || file.url,
      caption: file.originalname,
      imageType: file.imageType || 'exterior'
    }));

    property.images = [...(property.images || []), ...newImages];
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images: property.images }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a property image
// @route   DELETE /api/properties/:id/images/:imageId
// @access  Private (Agent/Admin)
const deletePropertyImage = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete images for this property'
      });
    }

    property.images = property.images.filter(
      img => img.public_id !== req.params.imageId && img._id.toString() !== req.params.imageId
    );

    await property.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: { images: property.images }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const properties = await Property.find({
      isFeatured: true,
      status: 'approved',
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
    .populate('agent', 'name email avatar company')
    .limit(limit)
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: { properties }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new launch properties
// @route   GET /api/properties/new-launches
// @access  Public
const getNewLaunches = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const properties = await Property.find({
      category: 'new-launch',
      status: 'approved',
      isActive: true,
      'projectDetails.launchDate': { $gte: new Date() }
    })
    .populate('agent', 'name email avatar company')
    .limit(limit)
    .sort({ 'projectDetails.launchDate': 1 });

    res.json({
      success: true,
      count: properties.length,
      data: { properties }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project properties
// @route   GET /api/properties/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const properties = await Property.find({
      category: 'project',
      status: { $in: ['approved', 'under-construction'] },
      isActive: true
    })
    .populate('agent', 'name email avatar company')
    .limit(limit)
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: { properties }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property like
// @route   POST /api/properties/:id/like
// @access  Private
const togglePropertyLike = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if already liked
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      property: property._id
    });

    if (existingFavorite) {
      // Unlike the property
      await Favorite.findByIdAndDelete(existingFavorite._id);
      property.likes = Math.max(0, property.likes - 1);
      await property.save();

      // Remove from arrays
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { favorites: existingFavorite._id }
      });
      await Property.findByIdAndUpdate(property._id, {
        $pull: { favorites: existingFavorite._id }
      });

      return res.json({
        success: true,
        message: 'Property unliked successfully',
        data: { likes: property.likes, isLiked: false }
      });
    } else {
      // Like the property
      const favorite = await Favorite.create({
        user: req.user.id,
        property: property._id
      });

      property.likes += 1;
      await property.save();

      // Add to arrays
      await User.findByIdAndUpdate(req.user.id, {
        $push: { favorites: favorite._id }
      });
      await Property.findByIdAndUpdate(property._id, {
        $push: { favorites: favorite._id }
      });

      return res.json({
        success: true,
        message: 'Property liked successfully',
        data: { likes: property.likes, isLiked: true }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update property status (Admin only)
// @route   PATCH /api/properties/:id/status
// @access  Private (Admin)
const updatePropertyStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'rejected' && { rejectionReason })
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
    if (status === 'approved' || status === 'rejected') {
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
    }

    res.json({
      success: true,
      message: `Property status updated to ${status}`,
      data: { property }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search properties
// @route   GET /api/properties/search
// @access  Public
const searchProperties = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const properties = await Property.find({
      $text: { $search: q },
      status: 'approved',
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
    .populate('agent', 'name email avatar company')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ score: { $meta: 'textScore' } });

    const total = await Property.countDocuments({
      $text: { $search: q },
      status: 'approved',
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

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

// @desc    Get properties by agent
// @route   GET /api/properties/agent/:agentId
// @access  Public
const getPropertiesByAgent = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const properties = await Property.find({
      agent: req.params.agentId,
      status: 'approved',
      isActive: true
    })
    .populate('agent', 'name email avatar company experience specializations')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

    const total = await Property.countDocuments({
      agent: req.params.agentId,
      status: 'approved',
      isActive: true
    });

    const agent = await User.findById(req.params.agentId)
      .select('name email avatar company experience specializations agentStats');

    res.json({
      success: true,
      data: {
        agent,
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

// @desc    Get similar properties
// @route   GET /api/properties/:id/similar
// @access  Public
const getSimilarProperties = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      category: property.category,
      type: property.type,
      status: 'approved',
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
    .populate('agent', 'name email avatar company')
    .limit(6)
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { properties: similarProperties }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  uploadPropertyImages,
  deletePropertyImage,
  getFeaturedProperties,
  getNewLaunches,
  getProjects,
  togglePropertyLike,
  updatePropertyStatus,
  searchProperties,
  getPropertiesByAgent,
  getSimilarProperties
};