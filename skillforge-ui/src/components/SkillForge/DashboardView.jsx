import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, Trophy, Target, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";
import LevelProgressBar from "./LevelProgressBar";
import LearningTask from "./LearningTask";

export default function DashboardView({
  backendUser,
  activeRoadmap,
  setCurrentView,
  setActiveRoadmapId,
  handleComplete,
  getCategoryColor,
  getCategoryIcon,
}) {
  if (!activeRoadmap || !backendUser) return null;

  const completedTasks = activeRoadmap.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = activeRoadmap.tasks?.length || 0;
  const completion = Math.round((completedTasks / totalTasks) * 100);

  return (
    <>
      {/* Back to list */}
      <div className="mb-6">
        <Button
          onClick={() => {
            setActiveRoadmapId(null);
            setCurrentView("roadmapsList");
          }}
          variant="ghost"
          className="inline-flex items-center text-gray-400 hover:text-white px-3 py-2 -ml-3 sm:-ml-4 rounded-md transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to All Roadmaps
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <StatCard title="TOTAL XP" value={backendUser.xp || 0} icon={Star} />
        <StatCard title="LEVEL" value={backendUser.level || 1} icon={Trophy} />
        <StatCard title="COMPLETE" value={`${completion}%`} icon={Target} />
        <StatCard title="TASKS" value={`${completedTasks}/${totalTasks}`} icon={CheckCircle} />
      </div>

      {/* Progress Bar */}
      <LevelProgressBar user={backendUser} />

      {/* Task List */}
      <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-lg sm:text-xl font-mono text-gray-300 mb-6 sm:mb-8 uppercase tracking-wider border-b border-gray-700 pb-2 sm:pb-4">
          Learning Modules
        </h2>
        <div className="space-y-4 sm:space-y-6">
          {activeRoadmap.tasks?.map((task, idx) => (
            <LearningTask
              key={task._id || idx}
              task={task}
              taskIndex={idx}
              handleComplete={handleComplete}
              getCategoryColor={getCategoryColor}
              getCategoryIcon={getCategoryIcon}

            />
          ))}
        </div>
      </div>
    </>
  );
}
