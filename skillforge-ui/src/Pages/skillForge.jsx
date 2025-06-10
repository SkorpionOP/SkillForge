import React, { useEffect } from "react";
import {
  Database, Code, Settings, Brain, Circle,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

import useSkillForgeData from "@/hooks/useSkillForgeData";
import DashboardHeader from "@/components/SkillForge/DashboardHeader";
import GeneratorForm from "@/components/SkillForge/GeneratorForm";
import DashboardView from "@/components/SkillForge/DashboardView";
import RoadmapListView from "@/components/SkillForge/RoadmapListView";
import MobileMenu from "@/components/SkillForge/MobileMenu";
import CongratsModal from "@/components/SkillForge/CongratsModal";
import { Loader } from "lucide-react";

export default function SkillForge() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get current view from URL params, default to 'roadmaps'
  const currentView = searchParams.get('view') || 'roadmaps';
  const roadmapId = searchParams.get('roadmapId');
  
  const {
    backendUser,
    currentUser,
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

  // Set active roadmap from URL
  useEffect(() => {
    if (roadmapId && roadmapId !== activeRoadmapId) {
      setActiveRoadmapId(roadmapId);
    }
  }, [roadmapId, activeRoadmapId, setActiveRoadmapId]);

  // Navigation functions using URL params
  const navigateToView = (view, options = {}) => {
    const params = new URLSearchParams();
    params.set('view', view);
    
    if (options.roadmapId) {
      params.set('roadmapId', options.roadmapId);
    }
    
    setSearchParams(params);
    closeMobileMenu();
  };

  const navigateToGenerator = () => navigateToView('generator');
  const navigateToRoadmapsList = () => navigateToView('roadmaps');
  const navigateToDashboard = (roadmapId) => {
    const id = roadmapId || activeRoadmapId;
    if (id) {
      navigateToView('dashboard', { roadmapId: id });
    } else {
      navigateToRoadmapsList();
    }
  };

  const handleBackNavigation = () => {
    if (currentView === 'generator') {
      if (activeRoadmap) {
        navigateToDashboard();
      } else {
        navigateToRoadmapsList();
      }
    } else if (currentView === 'dashboard') {
      navigateToRoadmapsList();
    } else {
      // If user presses back on roadmaps list, don't navigate away
      // Let browser handle it naturally
    }
  };

  const handleSelectRoadmapWithNav = (roadmap) => {
    handleSelectRoadmap(roadmap);
    navigateToDashboard(roadmap.id);
  };

  const generateRoadmapWithNav = async (data) => {
    const result = await generateRoadmap(data);
    if (result && result.roadmapId) {
      navigateToDashboard(result.roadmapId);
    }
    return result;
  };

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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'generator':
        return (
          <GeneratorForm
            formData={formData}
            setFormData={setFormData}
            generateRoadmap={generateRoadmapWithNav}
            loading={loading}
            onBackToDashboard={handleBackNavigation}
          />
        );
      
      case 'dashboard':
        return activeRoadmap ? (
          <DashboardView
            backendUser={backendUser}
            activeRoadmap={activeRoadmap}
            setCurrentView={(view) => {
              if (view === 'roadmapsList') navigateToRoadmapsList();
              else if (view === 'generator') navigateToGenerator();
            }}
            setActiveRoadmapId={setActiveRoadmapId}
            handleComplete={handleComplete}
            getCategoryColor={getCategoryColor}
            getCategoryIcon={(cat) =>
              getCategoryIcon(cat, { Database, Code, Settings, Brain, Circle })
            }
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No roadmap selected</p>
            <button 
              onClick={navigateToRoadmapsList}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              View Roadmaps
            </button>
          </div>
        );
      
      default:
        return (
          <RoadmapListView
            roadmaps={roadmaps}
            activeRoadmaps={activeRoadmaps}
            completedRoadmaps={completedRoadmaps}
            activeRoadmapId={activeRoadmapId}
            setCurrentView={(view) => {
              if (view === 'generator') navigateToGenerator();
              else if (view === 'dashboard') navigateToDashboard();
            }}
            closeMobileMenu={closeMobileMenu}
            handleSelectRoadmap={handleSelectRoadmapWithNav}
            handleDeleteRoadmap={handleDeleteRoadmap}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans relative">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <DashboardHeader
          user={backendUser}
          activeRoadmap={activeRoadmap}
          onGenerateNew={navigateToGenerator}
          onToggleMobileMenu={toggleMobileMenu}
          onLogout={handleLogout}
        />

        {showCongratulations && (
          <CongratsModal
            skillName={completedRoadmapSkill}
            onClose={() => setShowCongratulations(false)}
          />
        )}

        {renderCurrentView()}
      </div>

      <MobileMenu
        backendUser={backendUser}
        currentUser={currentUser}
        isMobileMenuOpen={isMobileMenuOpen}
        mobileMenuRef={mobileMenuRef}
        closeMobileMenu={closeMobileMenu}
        setCurrentView={(view) => {
          if (view === 'generator') navigateToGenerator();
          else if (view === 'roadmapsList') navigateToRoadmapsList();
          else if (view === 'dashboard') navigateToDashboard();
        }}
        handleLogout={handleLogout}
      />
    </div>
  );
}
