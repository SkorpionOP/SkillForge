// skillForge-backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User Mongoose model
const authMiddleware = require('../middleware/authMiddleware'); // <--- CORRECTED PATH HERE

// @route   POST /api/user/register
// @desc    Register a new user in MongoDB or verify existing
// @access  Public (protected by Firebase token verification)
router.post('/register', authMiddleware, async (req, res) => {
  const { uid, email, name } = req.body;

  try {
    let user = await User.findOne({ uid });

    if (user) {
      (`User with UID ${uid} already registered.`);
      return res.status(200).json({ message: 'User already registered', user });
    }

    user = new User({
      uid,
      email,
      name: name || email.split('@')[0],
      xp: 0,
      level: 1,
    });

    await user.save();
    (`New user registered: ${user.email} (UID: ${user.uid})`);
    res.status(201).json({ message: 'User registered successfully', user });

  } catch (err) {
    console.error('Error in user registration:', err.message);
    res.status(500).json({ message: 'Server error during user registration' });
  }
});

// @route   GET /api/user/profile
// @desc    Get authenticated user's profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).select('-__v -createdAt -updatedAt');

    if (!user) {
      return res.status(404).json({ message: 'User profile not found in database.' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});


module.exports = router;