// skillForge-backend/models/Roadmap.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  xp: { type: Number, required: true },
  estimatedTime: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { _id: true }); // Ensure subdocuments get an _id

const RoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  duration: { type: String, required: true },
  tasks: [TaskSchema],
  createdAt: { type: Date, default: Date.now },
  // ADD THIS NEW FIELD:
  isCompleted: { type: Boolean, default: false } // Indicates if ALL tasks are completed
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);