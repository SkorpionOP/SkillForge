// skillForge-backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true, // Firebase UID must be unique
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: 'New User', // Default name, can be updated later
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  activeRoadmap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap', // Reference to the currently active roadmap
    default: null, // No active roadmap initially
  },
  roadmaps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap', // Array of references to all roadmaps owned by this user
  }],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

const User = mongoose.model('User', userSchema);

module.exports = User;