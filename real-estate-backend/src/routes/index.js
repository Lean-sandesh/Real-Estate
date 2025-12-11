const express = require('express');
const authRoutes = require('./auth');
const propertyRoutes = require('./properties');
const userRoutes = require('./users');
const inquiryRoutes = require('./inquiries');
const adminRoutes = require('./admin');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/users', userRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/admin', adminRoutes);

module.exports = router;