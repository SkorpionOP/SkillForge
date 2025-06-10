// src/components/SkillForge/LearningTask.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock } from "lucide-react";

export default function LearningTask({ task, handleComplete, getCategoryColor, getCategoryIcon, taskIndex }) {
  const IconComponent = getCategoryIcon(task.category);

  return (
    <Card
      className={`group transition-all duration-200 hover:border-white/20 bg-black/40 border-white/10 backdrop-blur-sm ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <CardContent className="p-6">
        {/* Main layout: stacks vertically on mobile, horizontally on sm and up */}
        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
          {/* Left Part: Icon, Title, Description, XP/Time */}
          <div className="flex items-start gap-4 flex-grow">
            <div className={`w-12 h-12 rounded-lg border ${getCategoryColor(task.category)} flex items-center justify-center flex-shrink-0`}>
              {IconComponent && <IconComponent className="w-6 h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              {/* Title and Category */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 mb-2">
                <h3 className={`text-lg font-medium ${
                  task.completed ? 'line-through text-gray-500' : 'text-white'
                } leading-tight`}>
                  {task.title}
                </h3>
                <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded flex-shrink-0">
                  {task.category}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3 leading-relaxed">{task.description}</p>
              {/* XP and Estimated Time */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {task.xp} XP
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.estimatedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Right Part: Complete Button */}
          <button
            onClick={() => handleComplete(taskIndex)}
            disabled={task.completed}
            className={`mt-4 sm:mt-0 w-full sm:w-auto px-6 py-2 rounded-lg font-mono text-sm transition-all duration-200 flex-shrink-0 ${
              task.completed
                ? "bg-white/10 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {task.completed ? "DONE" : "COMPLETE"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
