// skillForge-backend/routes/roadmapRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

const { GoogleGenerativeAI } = require('@google/generative-ai');



// Helper function to generate roadmap content using Gemini
async function generateRoadmapContent(skill, duration) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Generate a detailed learning roadmap for "${skill}" over a period of "${duration}".
The roadmap should consist of 5-7 distinct tasks divided into these categories: Foundation, Implementation, Advanced, and Mastery.
For each task, provide:
- a concise title (e.g., "Understand React Basics", "Set up Development Environment")
- a detailed description of what needs to be learned/done for this task
- an estimated XP value (between 50 and 200, based on complexity)
- an estimated time to complete (e.g., "2-3 hours", "1 day", "3 days")
- a category (one of: "Foundation", "Implementation", "Advanced", "Mastery")

The output should be a JSON array of task objects, formatted exactly as follows:
[
  {
    "title": "Task Title 1",
    "description": "Detailed description of task 1.",
    "xp": 100,
    "estimatedTime": "2 days",
    "category": "Foundation"
  },
  {
    "title": "Task Title 2",
    "description": "Detailed description of task 2.",
    "xp": 150,
    "estimatedTime": "1 week",
    "category": "Implementation"
  }
]

Additional guidelines:
1. Start with 1-2 Foundation tasks (basic concepts/setup)
2. Include 2-3 Implementation tasks (practical applications)
3. Include 1-2 Advanced tasks (complex topics)
4. Optionally include 1 Mastery task (expert-level challenge)
5. Progress difficulty logically through the categories
6. Ensure the response is valid JSON and nothing else.`;
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text().replace(/```json|```/g, '').trim(); // Clean markdown
    ("Gemini Raw Response:", response.text());
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating content from Gemini:", error.message);
    throw new Error(`Failed to generate roadmap content: ${error.message}`);
  }
}

// @route   POST /api/roadmap/generate
// @desc    Generate a new learning roadmap
// @access  Private
router.post('/generate', authMiddleware, async (req, res) => {
  const { skill, duration } = req.body;
  const userId = req.user.uid;

  if (!skill || !duration) {
    return res.status(400).json({ message: 'Skill and duration are required.' });
  }

  try {
    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const tasks = await generateRoadmapContent(skill, duration);
    if (!Array.isArray(tasks) || tasks.length === 0) {
      throw new Error("Generated tasks are not in the expected format or are empty.");
    }

    const newRoadmap = new Roadmap({
      userId: user._id,
      skill,
      duration,
      tasks,
    });

    await newRoadmap.save();
    res.status(201).json({ message: 'Roadmap generated successfully!', roadmap: newRoadmap });

  } catch (err) {
    console.error('Error generating roadmap:', err.message);
    res.status(500).json({ message: `Server error during roadmap generation: ${err.message}` });
  }
});

// @route   GET /api/roadmap/all
// @desc    Get all roadmaps for the authenticated user
// @access  Private
router.get('/all', authMiddleware, async (req, res) => {
  const userId = req.user.uid;
  try {
    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const roadmaps = await Roadmap.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json(roadmaps);
  } catch (err) {
    console.error('Error fetching all roadmaps:', err.message);
    res.status(500).json({ message: 'Failed to fetch all roadmaps.' });
  }
});

// @route   GET /api/roadmap/:id
// @desc    Get a single roadmap by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found.' });
    }
    // Ensure roadmap belongs to the authenticated user
    const user = await User.findOne({ uid: req.user.uid });
    if (!user || !roadmap.userId.equals(user._id)) {
      return res.status(403).json({ message: 'Unauthorized: Roadmap does not belong to user.' });
    }
    res.status(200).json(roadmap);
  } catch (err) {
    console.error('Error fetching roadmap by ID:', err.message);
    res.status(500).json({ message: 'Failed to fetch roadmap.' });
  }
});

// @route   DELETE /api/roadmap/:id
// @desc    Delete a roadmap by ID
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const roadmapId = req.params.id;
    const userId = req.user.uid;

    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found.' });
    }

    if (!roadmap.userId.equals(user._id)) {
      return res.status(403).json({ message: 'Unauthorized: Roadmap does not belong to user.' });
    }

    await Roadmap.deleteOne({ _id: roadmapId }); // Use deleteOne for clarity
    res.status(200).json({ message: 'Roadmap deleted successfully.' });

  } catch (err) {
    console.error('Error deleting roadmap:', err.message);
    res.status(500).json({ message: 'Server error during roadmap deletion.' });
  }
});


// NEW: Helper function to check and update roadmap completion status
async function checkAndMarkRoadmapCompleted(roadmap) {
    const allTasksCompleted = roadmap.tasks.every(task => task.completed);
    if (allTasksCompleted && !roadmap.isCompleted) {
        roadmap.isCompleted = true;
        await roadmap.save();
        return true; // Roadmap newly completed
    }
    return false; // Not completed or already completed
}

// @route   POST /api/roadmap/:id/complete-task
// @desc    Mark a task as complete and update user XP/level
// @access  Private
router.post('/:id/complete-task', authMiddleware, async (req, res) => {
  const roadmapId = req.params.id;
  const { taskIndex } = req.body;
  const userId = req.user.uid;

  try {
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found.' });
    }
    const user = await User.findOne({ uid: userId });
    if (!user || !roadmap.userId.equals(user._id)) {
      return res.status(403).json({ message: 'Unauthorized: Roadmap does not belong to user.' });
    }

    if (taskIndex < 0 || taskIndex >= roadmap.tasks.length) {
      return res.status(400).json({ message: 'Invalid task index.' });
    }

    const task = roadmap.tasks[taskIndex];
    if (task.completed) {
      // If task already completed, return roadmap and user without changes
      return res.status(200).json({ message: 'Task already completed.', roadmap, user });
    }

    task.completed = true;
    user.xp += task.xp;

    // Check for level up
    const xpForNextLevel = user.level * 1000; // Simple example: 1000 XP per level
    if (user.xp >= xpForNextLevel) {
      user.level += 1;
      // Optionally, set XP back to 0 or adjust for next level
      // user.xp = user.xp - xpForNextLevel; // If you want to reset XP per level
    }

    await roadmap.save();
    await user.save();

    const wasNewlyCompleted = await checkAndMarkRoadmapCompleted(roadmap); // Check if roadmap completed

    // Return the updated roadmap and user
    res.status(200).json({
        message: 'Task completed successfully!',
        roadmap,
        user,
        roadmapNewlyCompleted: wasNewlyCompleted // Indicate if roadmap was newly completed
    });

  } catch (err) {
    console.error('Error completing task:', err.message);
    res.status(500).json({ message: 'Server error during task completion.' });
  }
});

// NEW API ENDPOINT: Manually mark roadmap as completed (though auto-check in complete-task is primary)
// This can be useful for edge cases or if a roadmap is completed outside task flow.
router.post('/:id/mark-completed', authMiddleware, async (req, res) => {
    const roadmapId = req.params.id;
    const userId = req.user.uid;

    try {
        const roadmap = await Roadmap.findById(roadmapId);
        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found.' });
        }
        const user = await User.findOne({ uid: userId });
        if (!user || !roadmap.userId.equals(user._id)) {
            return res.status(403).json({ message: 'Unauthorized: Roadmap does not belong to user.' });
        }

        // Ensure all tasks are actually completed before marking roadmap completed
        const allTasksCompleted = roadmap.tasks.every(task => task.completed);
        if (!allTasksCompleted) {
            return res.status(400).json({ message: 'Cannot mark roadmap completed: Not all tasks are finished.' });
        }

        if (roadmap.isCompleted) {
            return res.status(200).json({ message: 'Roadmap already marked as completed.', roadmap });
        }

        roadmap.isCompleted = true;
        await roadmap.save();

        res.status(200).json({ message: 'Roadmap marked as completed successfully!', roadmap });

    } catch (err) {
        console.error('Error marking roadmap as completed:', err.message);
        res.status(500).json({ message: 'Server error marking roadmap as completed.' });
    }
});


module.exports = router;
