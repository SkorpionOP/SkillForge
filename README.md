

# 🚀 SkillForge

**SkillForge** is your AI-powered learning companion that crafts personalized skill roadmaps and helps you master any skill with structured plans, gamified tracking, and intelligent insights. Powered by the Gemini API, it transforms vague goals into clear, actionable steps with XP-based progression to keep you motivated and on track.

## 🌟 Features

* 🎯 **AI-Generated Roadmaps**
  Input your desired skill and available time — let SkillForge generate a tailored learning path.

* 📅 **Timeline & XP Allocation**
  Each task comes with an estimated duration and XP value to help manage your effort and track progress.

* 📈 **Progress Tracker**
  Tick off completed tasks and visually track your journey from novice to expert.

* 🧠 **Smart Recommendations** *(Planned)*
  Based on your progress, SkillForge will suggest resources and optimize your path dynamically.

* 🏆 **Gamification**
  Earn XP for every completed task and level up as you grow.

## 🛠️ Tech Stack

**Frontend**

* React + Tailwind CSS
* Framer Motion (for animations)
* Zustand (for state management)

**Backend**

* Node.js + Express
* Gemini API integration (for generating learning roadmaps)
* MongoDB (for storing user data and progress)

## 🧑‍💻 How It Works

1. User enters a skill (e.g., “Learn Web Development”) and duration (e.g., 3 months).
2. SkillForge sends this data to the Gemini API.
3. Gemini returns a detailed, XP-based roadmap broken down into weekly tasks.
4. The roadmap is displayed in a clean UI where users can:

   * Mark tasks as complete ✅
   * Track progress 📊
   * View current XP and goals 💡

## 🚧 Roadmap

* [x] Generate roadmap from user input
* [x] Display roadmap with XP and weekly structure
* [x] Add task completion and XP tracking
* [x] Integrate user authentication
* [x] Save user progress to database
* [ ] Add smart reminders and adaptive planning
* [x] Mobile support

## 🧪 Getting Started

### Prerequisites

* Node.js & npm
* OpenAI Gemini API Key

### Installation

```bash
git clone https://github.com/yourusername/SkillForge.git
cd SkillForge
npm install
```

### Run the App

```bash
npm start
```

## 🌐 API Integration

SkillForge uses the **Gemini API** to generate learning paths. The API response is expected to return:

```json
{
  "roadmap": [
    {
      "week": 1,
      "tasks": [
        { "title": "Intro to HTML", "xp": 50 },
        { "title": "Build a basic webpage", "xp": 100 }
      ]
    },
    ...
  ]
}
```

> *(Details on request structure can be added here if you're exposing it as a public API)*

## 🤝 Contributing

Contributions, ideas, and suggestions are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License © 2025 \ @SkorpionOP


