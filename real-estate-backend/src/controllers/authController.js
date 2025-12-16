const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, address, company, licenseNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: role || 'user',
      company,
      licenseNumber,
      emailVerificationToken: crypto.randomBytes(32).toString('hex')
    });

    const token = generateToken(user._id);

    try {
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${user.emailVerificationToken}`;
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Email - RealEstate Pro',
        template: 'emailVerification',
        data: { name: user.name, verificationUrl }
      });
    } catch (err) {
      console.log('Email send failed', err);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          company: user.company,
          isEmailVerified: user.isEmailVerified
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register agent
// @route   POST /api/auth/register/agent
// @access  Public
const registerAgent = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, company, licenseNumber, experience, specializations } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: 'agent',
      company,
      licenseNumber,
      experience,
      specializations,
      emailVerificationToken: crypto.randomBytes(32).toString('hex'),
      isActive: false
    });

    const token = generateToken(user._id);

    try {
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${user.emailVerificationToken}`;
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Email - RealEstate Pro Agent',
        template: 'agentVerification',
        data: { name: user.name, verificationUrl, company: user.company }
      });
    } catch (err) {
      console.log('Agent email send failed', err);
    }

    res.status(201).json({
      success: true,
      message: 'Agent registration submitted. Please verify email and wait for admin approval.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          company: user.company,
          licenseNumber: user.licenseNumber,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');

    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (user.role === "agent" && !user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your agent account is awaiting admin approval'
      });
    }

    if (user.role === "user" && !user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is not active. Contact support.'
      });
    }

    const isPwd = await user.comparePassword(password);
    if (!isPwd)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user._id);

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Login successful',
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
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address, company, bio, website, socialMedia, experience, specializations } = req.body;

    if (email && email !== req.user.email) {
      const exist = await User.findOne({ email });
      if (exist)
        return res.status(400).json({ success: false, message: 'Email already taken' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address, company, bio, website, socialMedia, experience, specializations },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user location
// @route   PUT /api/auth/update-location
// @access  Private
const updateLocation = async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address || (!address.city && !address.state && !address.country)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least city, state, or country'
      });
    }

    const user = await User.findById(req.user.id);
    
    user.address = {
      ...user.address.toObject(),
      ...address
    };

    await user.save();

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        address: user.address,
        formattedAddress: user.getFormattedAddress(),
        hasCompleteLocation: user.hasCompleteLocation(),
        profileCompletion: user.profileCompletion
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/auth/update-preferences
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

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password changed successfully',
      data: { token }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAll = async (req, res) => {
  res.json({ success: true, message: 'Logged out from all devices' });
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: true, message: 'If email exists, reset link sent.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request - RealEstate Pro',
        template: 'passwordReset',
        data: { name: user.name, resetUrl, expiry: '30 minutes' }
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.json({ success: true, message: 'If email exists, reset link sent.' });

  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const authToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password reset successful',
      data: { token: authToken }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid verification token' });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });

  } catch (error) {
    next(error);
  }
};

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.isEmailVerified)
      return res.status(400).json({ success: false, message: 'Email already verified or user not found' });

    user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${user.emailVerificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Email - RealEstate Pro',
        template: 'emailVerification',
        data: { name: user.name, verificationUrl }
      });
    } catch (err) {
      user.emailVerificationToken = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.json({
      success: true,
      message: "Verification email sent (If user exists)"
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get users by location
// @route   GET /api/auth/users/location
// @access  Private/Admin
const getUsersByLocation = async (req, res, next) => {
  try {
    const { city, state, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
          formattedAddress: user.getFormattedAddress(),
          isActive: user.isActive,
          profileCompletion: user.profileCompletion
        })),
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

// @desc    Get agents by location
// @route   GET /api/auth/agents/location
// @access  Public
const getAgentsByLocation = async (req, res, next) => {
  try {
    const { city, state, page = 1, limit = 12 } = req.query;
    
    const agents = await User.findAgentsByLocation(city, state)
      .select('name email phone company experience specializations avatar address agentStats')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'agentStats.rating': -1, 'agentStats.totalProperties': -1 });

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
      avatar: agent.avatar,
      address: agent.address,
      formattedAddress: agent.getFormattedAddress(),
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

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

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
// @route   GET /api/auth/users/:id
// @access  Private/Admin
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken');

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PATCH /api/auth/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

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
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  registerAgent,
  login,
  getMe,
  updateProfile,
  updateLocation,
  updatePreferences,
  changePassword,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getUsersByLocation,
  getAgentsByLocation,
  getUsers,
  getUser,
  updateUserStatus,
  deleteUser
};