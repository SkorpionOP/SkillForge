import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import RoadmapCard from "./RoadmapCard";

export default function RoadmapListView({
  roadmaps,
  activeRoadmaps,
  completedRoadmaps,
  activeRoadmapId,
  setCurrentView,
  closeMobileMenu,
  handleSelectRoadmap,
  handleDeleteRoadmap,
}) {
  const hasNoRoadmaps = roadmaps.length === 0;

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {hasNoRoadmaps ? (
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-6 sm:p-10 text-center shadow-2xl border border-gray-700">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-4 sm:mb-6">
            No Roadmaps Yet!
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Start your learning journey by generating your first personalized roadmap.
          </p>
          <Button
            onClick={() => {
              setCurrentView("generator");
              closeMobileMenu();
            }}
            className="inline-flex items-center px-6 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 group"
          >
            <PlusCircle className="w-5 h-5 mr-2 sm:w-6 sm:h-6 sm:mr-3 group-hover:rotate-90 transition-transform" />
            Generate New Roadmap
          </Button>
        </div>
      ) : (
        <>
          {activeRoadmaps.length > 0 && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">Your Active Roadmaps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {activeRoadmaps.map((roadmap) => (
                  <RoadmapCard
                    key={roadmap._id}
                    roadmap={roadmap}
                    onSelect={handleSelectRoadmap}
                    onDelete={handleDeleteRoadmap}
                    isActive={roadmap._id === activeRoadmapId}
                    isCompleted={roadmap.isCompleted}
                  />
                ))}
              </div>
              <div className="border-t border-gray-700 my-8"></div>
            </>
          )}

          {completedRoadmaps.length > 0 && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">Completed Roadmaps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {completedRoadmaps.map((roadmap) => (
                  <RoadmapCard
                    key={roadmap._id}
                    roadmap={roadmap}
                    onSelect={handleSelectRoadmap}
                    onDelete={handleDeleteRoadmap}
                    isActive={roadmap._id === activeRoadmapId}
                    isCompleted={roadmap.isCompleted}
                  />
                ))}
              </div>
            </>
          )}

          <div className="mt-6 sm:mt-8 text-center">
            <Button
              onClick={() => {
                setCurrentView("generator");
                closeMobileMenu();
              }}
              className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Generate Another Roadmap
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
