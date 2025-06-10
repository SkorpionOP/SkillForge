import React from "react";
import {
  Database, Code, Settings, Brain, Circle,
} from "lucide-react";

import useSkillForgeData from "@/hooks/useSkillForgeData";
import DashboardHeader from "@/components/SkillForge/DashboardHeader";
import GeneratorForm from "@/components/SkillForge/GeneratorForm";
import DashboardView from "@/components/SkillForge/DashboardView";
import RoadmapListView from "@/components/SkillForge/RoadmapListView";
import MobileMenu from "@/components/SkillForge/MobileMenu";
import CongratsModal from "@/components/SkillForge/CongratsModal";
import { Loader } from "lucide-react";

export default function SkillForge() {
  const {
    backendUser,
    currentUser,
    currentView,
    setCurrentView,
    roadmaps,
    activeRoadmaps,
    completedRoadmaps,
    activeRoadmap,
    activeRoadmapId,
    setActiveRoadmapId,
    formData,
    setFormData,
    loading,
    error,
    showCongratulations,
    setShowCongratulations,
    completedRoadmapSkill,
    mobileMenuRef,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    handleLogout,
    handleSelectRoadmap,
    handleDeleteRoadmap,
    generateRoadmap,
    handleComplete,
    getCategoryColor,
    getCategoryIcon,
  } = useSkillForgeData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-300 flex items-center justify-center flex-col">
        <Loader className="w-12 h-12 animate-spin text-purple-400 mb-4" />
        <p className="text-xl">Loading SkillForge...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
        <p className="text-lg sm:text-xl text-red-400 mb-6 text-center font-semibold">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition">
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans relative">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <DashboardHeader
          user={backendUser}
          activeRoadmap={activeRoadmap}
          onGenerateNew={() => {
            setCurrentView("generator");
            closeMobileMenu();
          }}
          onToggleMobileMenu={toggleMobileMenu}
          onLogout={handleLogout}
        />

        {showCongratulations && (
          <CongratsModal
            skillName={completedRoadmapSkill}
            onClose={() => setShowCongratulations(false)}
          />
        )}

        {currentView === "generator" ? (
          <GeneratorForm
            formData={formData}
            setFormData={setFormData}
            generateRoadmap={generateRoadmap}
            loading={loading}
            onBackToDashboard={() =>
              setCurrentView(activeRoadmap ? "dashboard" : "roadmapsList")
            }
          />
        ) : currentView === "dashboard" && activeRoadmap ? (
          <DashboardView
            backendUser={backendUser}
            activeRoadmap={activeRoadmap}
            setCurrentView={setCurrentView}
            setActiveRoadmapId={setActiveRoadmapId}
            handleComplete={handleComplete}
            getCategoryColor={getCategoryColor}
            getCategoryIcon={(cat) =>
              getCategoryIcon(cat, { Database, Code, Settings, Brain, Circle })
            }
          />
        ) : (
          <RoadmapListView
            roadmaps={roadmaps}
            activeRoadmaps={activeRoadmaps}
            completedRoadmaps={completedRoadmaps}
            activeRoadmapId={activeRoadmapId}
            setCurrentView={setCurrentView}
            closeMobileMenu={closeMobileMenu}
            handleSelectRoadmap={handleSelectRoadmap}
            handleDeleteRoadmap={handleDeleteRoadmap}
          />
        )}
      </div>

      <MobileMenu
        backendUser={backendUser}
        currentUser={currentUser}
        isMobileMenuOpen={isMobileMenuOpen}
        mobileMenuRef={mobileMenuRef}
        closeMobileMenu={closeMobileMenu}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      />
    </div>
  );
}
