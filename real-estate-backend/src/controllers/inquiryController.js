const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// @desc    Create inquiry
// @route   POST /api/inquiries
// @access  Private
const createInquiry = async (req, res, next) => {
  try {
    const { propertyId, type, subject, message, contactPreference, preferredContactTime, urgency, budget, timeline } = req.body;

    const property = await Property.findById(propertyId).populate('agent');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.agent._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create inquiry for your own property'
      });
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      user: req.user.id,
      agent: property.agent._id,
      type: type || 'general',
      subject: subject || `Inquiry about ${property.title}`,
      message,
      contactPreference,
      preferredContactTime,
      urgency,
      budget,
      timeline,
      source: 'website'
    });

    await inquiry.populate('user', 'name email phone');
    await inquiry.populate('property', 'title price location images');
    await inquiry.populate('agent', 'name email phone');

    // Send notification to agent
    try {
      await sendEmail({
        email: property.agent.email,
        subject: 'New Property Inquiry - RealEstate Pro',
        template: 'newInquiry',
        data: {
          agentName: property.agent.name,
          propertyTitle: property.title,
          userName: req.user.name,
          userEmail: req.user.email,
          userPhone: req.user.phone,
          message: message,
          inquiryUrl: `${req.protocol}://${req.get('host')}/agent/inquiries/${inquiry._id}`
        }
      });
    } catch (emailError) {
      console.log('Agent notification email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user inquiries
// @route   GET /api/inquiries/my-inquiries
// @access  Private
const getMyInquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title price location images status')
      .populate('agent', 'name email phone avatar company')
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

// @desc    Get inquiries for agent's properties
// @route   GET /api/inquiries/agent/inquiries
// @access  Private (Agent/Admin)
const getAgentInquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;

    const query = { agent: req.user.id };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title price location images')
      .populate('user', 'name email phone avatar')
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

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
// @access  Private
const getInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property', 'title price location images specifications')
      .populate('user', 'name email phone avatar')
      .populate('agent', 'name email phone avatar company')
      .populate('responses.user', 'name email avatar role');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check authorization
    if (inquiry.user._id.toString() !== req.user.id && 
        inquiry.agent._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this inquiry'
      });
    }

    res.json({
      success: true,
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
// @access  Private (Agent/Admin)
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status, priority } = req.body;
    
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property')
      .populate('user');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    if (inquiry.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry'
      });
    }

    inquiry.status = status;
    if (priority) inquiry.priority = priority;
    await inquiry.save();

    res.json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule visit
// @route   PUT /api/inquiries/:id/visit
// @access  Private (Agent/Admin)
const scheduleVisit = async (req, res, next) => {
  try {
    const { date, time, duration, notes } = req.body;
    
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property')
      .populate('user');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    if (inquiry.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule visit for this inquiry'
      });
    }

    inquiry.scheduledVisit = {
      date,
      time,
      duration: duration || 30,
      status: 'pending',
      notes: notes || '',
      reminderSent: false
    };

    inquiry.status = 'viewing_scheduled';
    await inquiry.save();

    // Send visit scheduled notification to user
    try {
      await sendEmail({
        email: inquiry.user.email,
        subject: 'Property Viewing Scheduled - RealEstate Pro',
        template: 'visitScheduled',
        data: {
          userName: inquiry.user.name,
          propertyTitle: inquiry.property.title,
          visitDate: new Date(date).toLocaleDateString(),
          visitTime: time,
          agentName: req.user.name,
          agentPhone: req.user.phone,
          notes: notes || 'No additional notes provided'
        }
      });
    } catch (emailError) {
      console.log('Visit scheduled notification email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Visit scheduled successfully',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update visit status
// @route   PUT /api/inquiries/:id/visit-status
// @access  Private (Agent/Admin)
const updateVisitStatus = async (req, res, next) => {
  try {
    const { visitStatus, visitNotes } = req.body;
    
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property')
      .populate('user');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    if (inquiry.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry'
      });
    }

    if (!inquiry.scheduledVisit) {
      return res.status(400).json({
        success: false,
        message: 'No scheduled visit for this inquiry'
      });
    }

    inquiry.scheduledVisit.status = visitStatus;
    if (visitNotes) inquiry.scheduledVisit.notes = visitNotes;
    
    if (visitStatus === 'completed') {
      inquiry.scheduledVisit.reminderSent = true;
    }

    await inquiry.save();

    res.json({
      success: true,
      message: 'Visit status updated successfully',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add response to inquiry
// @route   POST /api/inquiries/:id/responses
// @access  Private
const addResponse = async (req, res, next) => {
  try {
    const { message, isInternal = false } = req.body;
    
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property')
      .populate('user')
      .populate('agent');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check authorization
    const isUser = inquiry.user._id.toString() === req.user.id;
    const isAgent = inquiry.agent._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isUser && !isAgent && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this inquiry'
      });
    }

    // Add response
    inquiry.responses.push({
      user: req.user.id,
      message,
      isInternal: isInternal && (isAgent || isAdmin)
    });

    // Update status if it's the first response from agent
    if ((isAgent || isAdmin) && inquiry.status === 'new') {
      inquiry.status = 'contacted';
    }

    inquiry.lastContacted = new Date();
    await inquiry.save();

    await inquiry.populate('responses.user', 'name email avatar role');

    // Send notification to the other party
    if (!isInternal) {
      const recipient = isUser ? inquiry.agent : inquiry.user;
      try {
        await sendEmail({
          email: recipient.email,
          subject: `New Response - Inquiry about ${inquiry.property.title}`,
          template: 'inquiryResponse',
          data: {
            recipientName: recipient.name,
            senderName: req.user.name,
            propertyTitle: inquiry.property.title,
            message: message,
            inquiryUrl: `${req.protocol}://${req.get('host')}/inquiries/${inquiry._id}`
          }
        });
      } catch (emailError) {
        console.log('Response notification email failed:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Response added successfully',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add internal note
// @route   POST /api/inquiries/:id/notes
// @access  Private (Agent/Admin)
const addInternalNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    if (inquiry.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this inquiry'
      });
    }

    inquiry.internalNotes.push({
      user: req.user.id,
      note
    });

    await inquiry.save();

    res.status(201).json({
      success: true,
      message: 'Internal note added successfully',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule follow-up
// @route   POST /api/inquiries/:id/follow-ups
// @access  Private (Agent/Admin)
const scheduleFollowUp = async (req, res, next) => {
  try {
    const { scheduledDate, notes, method } = req.body;
    
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    if (inquiry.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule follow-ups for this inquiry'
      });
    }

    inquiry.followUps.push({
      scheduledDate,
      notes: notes || '',
      method: method || 'email',
      status: 'scheduled'
    });

    inquiry.status = 'follow_up';
    await inquiry.save();

    res.status(201).json({
      success: true,
      message: 'Follow-up scheduled successfully',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark inquiry as read
// @route   PATCH /api/inquiries/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check authorization
    if (inquiry.user.toString() !== req.user.id && 
        inquiry.agent.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this inquiry'
      });
    }

    const alreadyRead = inquiry.readBy.some(read => read.user.toString() === req.user.id);
    
    if (!alreadyRead) {
      inquiry.readBy.push({
        user: req.user.id,
        readAt: new Date()
      });
      await inquiry.save();
    }

    res.json({
      success: true,
      message: 'Inquiry marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inquiry statistics for agent
// @route   GET /api/inquiries/agent/stats
// @access  Private (Agent/Admin)
const getInquiryStats = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;

    const stats = await Inquiry.getInquiryStats(req.user.id, period);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming visits for agent
// @route   GET /api/inquiries/agent/upcoming-visits
// @access  Private (Agent/Admin)
const getUpcomingVisits = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;

    const visits = await Inquiry.getUpcomingVisits(req.user.id, parseInt(days));

    res.json({
      success: true,
      data: { visits }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overdue follow-ups for agent
// @route   GET /api/inquiries/agent/overdue-followups
// @access  Private (Agent/Admin)
const getOverdueFollowUps = async (req, res, next) => {
  try {
    const followUps = await Inquiry.getOverdueFollowUps(req.user.id);

    res.json({
      success: true,
      data: { followUps }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  getAgentInquiries,
  getInquiry,
  updateInquiryStatus,
  scheduleVisit,
  updateVisitStatus,
  addResponse,
  addInternalNote,
  scheduleFollowUp,
  markAsRead,
  getInquiryStats,
  getUpcomingVisits,
  getOverdueFollowUps
};