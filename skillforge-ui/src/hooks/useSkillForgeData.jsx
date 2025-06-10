import { useState, useEffect, useCallback, useRef } from "react";
import { callBackendApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Database, Code, Settings, Brain, Circle } from "lucide-react";

export default function useSkillForgeData() {
  const { currentUser, loading: authLoading, logout, getIdToken } = useAuth();

  const [currentView, setCurrentView] = useState("roadmapsList");
  const [backendUser, setBackendUser] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [completedRoadmapSkill, setCompletedRoadmapSkill] = useState("");
  const [formData, setFormData] = useState({ skill: "", duration: "" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const activeRoadmaps = roadmaps.filter((r) => !r.isCompleted);
  const completedRoadmaps = roadmaps.filter((r) => r.isCompleted);
  const activeRoadmap = activeRoadmaps.find((r) => r._id === activeRoadmapId);

  const fetchUserDataAndRoadmaps = useCallback(async (user, token) => {
    setError(null);
    try {
      const userResponse = await callBackendApi("/user/register", token, "POST", {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split("@")[0] || "New User",
      });
      setBackendUser(userResponse.user);

      const roadmaps = await callBackendApi("/roadmap/all", token);
      setRoadmaps(roadmaps);
      setCurrentView("roadmapsList");
    } catch (err) {
      setError(err.message || "Failed to load user or roadmaps.");
      setRoadmaps([]);
    }
  }, []);

  const generateRoadmap = useCallback(async () => {
    const token = await getIdToken();
    if (!token) return setError("Authentication token is missing.");

    setLoading(true);
    try {
      await callBackendApi("/roadmap/generate", token, "POST", formData);
      await fetchUserDataAndRoadmaps(currentUser, token);
      setFormData({ skill: "", duration: "" });
      setCurrentView("roadmapsList");
      setIsMobileMenuOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [formData, currentUser, fetchUserDataAndRoadmaps, getIdToken]);

  const handleComplete = useCallback(
    async (taskIndex) => {
      const token = await getIdToken();
      if (!activeRoadmap || !token) return;

      setLoading(true);
      try {
        const res = await callBackendApi(
          `/roadmap/${activeRoadmap._id}/complete-task`,
          token,
          "POST",
          { taskIndex }
        );
        setRoadmaps((prev) =>
          prev.map((r) => (r._id === res.roadmap._id ? res.roadmap : r))
        );
        setBackendUser(res.user);

        if (res.roadmapNewlyCompleted) {
          setCompletedRoadmapSkill(res.roadmap.skill);
          setShowCongratulations(true);
          setActiveRoadmapId(null);
          setCurrentView("roadmapsList");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [activeRoadmap, getIdToken]
  );

  const handleDeleteRoadmap = useCallback(
    async (id) => {
      const token = await getIdToken();
      if (!token || !window.confirm("Delete this roadmap?")) return;

      setLoading(true);
      try {
        await callBackendApi(`/roadmap/${id}`, token, "DELETE");
        setRoadmaps((prev) => prev.filter((r) => r._id !== id));
        if (activeRoadmapId === id) {
          setActiveRoadmapId(null);
          setCurrentView("roadmapsList");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [activeRoadmapId, getIdToken]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      alert("Logout failed");
    }
  }, [logout]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSelectRoadmap = (id) => {
    setActiveRoadmapId(id);
    setCurrentView("dashboard");
    closeMobileMenu();
  };

  const getCategoryColor = (cat) =>
    ({
      Foundation: "border-blue-400/30 bg-blue-400/5",
      Implementation: "border-green-400/30 bg-green-400/5",
      Advanced: "border-orange-400/30 bg-orange-400/5",
      Mastery: "border-red-400/30 bg-red-400/5",
    }[cat] || "border-gray-400/30 bg-gray-400/5");

  const getCategoryIcon = useCallback((category) => {
    const icons = {
      Foundation: <Database className="w-4 h-4" />,
      Implementation: <Code className="w-4 h-4" />,
      Advanced: <Settings className="w-4 h-4" />,
      Mastery: <Brain className="w-4 h-4" />,
    };
    return icons[category] || <Circle className="w-4 h-4" />;
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const token = await getIdToken();
          await fetchUserDataAndRoadmaps(currentUser, token);
        } catch (err) {
          setError("Authentication error. Try re-logging.");
        } finally {
          setLoading(false);
        }
      } else {
        // Clear data when logged out
        setBackendUser(null);
        setRoadmaps([]);
        setActiveRoadmapId(null);
      }
    };

    if (!authLoading) {
      loadInitialData();
    }
  }, [currentUser, authLoading, getIdToken, fetchUserDataAndRoadmaps]);

  return {
    currentUser,
    backendUser,
    currentView,
    setCurrentView,
    roadmaps,
    activeRoadmap,
    activeRoadmapId,
    setActiveRoadmapId,
    activeRoadmaps,
    completedRoadmaps,
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
  };
}
