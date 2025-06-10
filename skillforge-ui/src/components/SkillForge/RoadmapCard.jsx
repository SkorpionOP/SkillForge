// src/components/SkillForge/RoadmapCard.jsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Trash, CheckCircle } from "lucide-react"; // Import CheckCircle for completed badge

export default function RoadmapCard({ roadmap, onSelect, onDelete, isActive, isCompleted }) {
    const completionPercentage = roadmap.tasks.length > 0
        ? Math.round((roadmap.tasks.filter(task => task.completed).length / roadmap.tasks.length) * 100)
        : 0;

    return (
        <div className={`
            relative bg-gray-800/70 backdrop-blur-md rounded-xl p-6 sm:p-7 shadow-2xl
            flex flex-col justify-between transition-all duration-300 transform
            ${isActive ? 'border-2 border-purple-500 scale-[1.02]' : 'border border-gray-700 hover:scale-[1.005]'}
            ${isCompleted ? 'opacity-70 grayscale-[30%] border-green-500/50' : ''}
        `}>
            {isCompleted && (
                <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                    <CheckCircle className="w-3 h-3" /> COMPLETED
                </div>
            )}

            <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-2 sm:mb-3 truncate">
                {roadmap.skill}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-5 line-clamp-2">
                {roadmap.tasks[0]?.description || "No description available."}
            </p>

            <div className="flex items-center justify-between text-gray-300 text-sm sm:text-base mb-5 sm:mb-6">
                <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    {completionPercentage}% Complete
                </span>
                <span className="font-mono">{roadmap.duration}</span>
            </div>

            <div className="flex gap-3 mt-auto">
                <Button
                    onClick={() => onSelect(roadmap._id)}
                    className={`flex-grow inline-flex items-center justify-center px-4 py-2 text-sm sm:text-base font-semibold rounded-md
                                ${isCompleted ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}
                                transition-colors duration-200`}
                >
                    {isCompleted ? 'View Course' : 'Continue Learning'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onDelete(roadmap._id); }}
                    className="flex-shrink-0 w-10 h-10 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                >
                    <Trash className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}