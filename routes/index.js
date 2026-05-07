const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');

// Mount the auth routes
router.use('/auth', authRoutes);

// You can add more routes here later
// router.use('/users', userRoutes);

module.exports = router;