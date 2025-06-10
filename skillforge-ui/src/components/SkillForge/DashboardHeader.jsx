// src/components/SkillForge/DashboardHeader.jsx
import { Activity, Plus, User, LogOut, Settings as SettingsIcon } from "lucide-react"; // Removed LayoutList import
import { Menu } from "lucide-react"; // Ensure Menu icon is imported for mobile toggle
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// ADD 'onLogout' to the props destructuring
export default function DashboardHeader({ activeRoadmap, user, onGenerateNew, onToggleMobileMenu, onLogout }) {
  const completionRate = activeRoadmap?.tasks?.length > 0
    ? Math.round((activeRoadmap.tasks.filter(task => task.completed).length / activeRoadmap.tasks.length) * 100)
    : 0;

  return (
    <div className="flex items-center justify-between mb-12 py-4 px-4 sm:px-6 bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800">

      {/* Left section: Activity icon, SkillForge title, Duration & Progress */}
      <div className="flex items-center gap-4 sm:gap-6 flex-grow">
        <div className="w-10 h-10 border border-white/20 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
          <Activity className="w-5 h-5 text-purple-400" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-light tracking-wide text-gray-50 truncate">
            {activeRoadmap?.skill?.toUpperCase() || "SKILLFORGE"}
          </h1>
          <p className="text-gray-400 font-mono text-xs sm:text-sm mt-1 truncate">
            Duration: {activeRoadmap?.duration || 'N/A'} • Progress: {completionRate}%
          </p>
        </div>
      </div>

      {/* Right section: Action buttons & User Dropdown (Desktop) or Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-4 flex-shrink-0">

        {/* Desktop Buttons and Dropdown (visible on md screens and up) */}
        <div className="hidden md:flex items-center gap-2 sm:gap-4">
          {/* Removed "All Roadmaps" Button */}

          <Button
              onClick={onGenerateNew}
              variant="outline"
              className="px-3 py-2 bg-black/40 border-white/10 backdrop-blur-sm text-sm font-mono text-gray-200 hover:text-white transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            NEW
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-3 py-2 bg-black/40 border-white/10 backdrop-blur-sm text-sm font-mono text-gray-200 hover:text-white max-w-36 overflow-hidden truncate"
              >
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{user?.name || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border border-gray-700 text-white rounded-lg shadow-xl p-2 z-50">
              <DropdownMenuLabel className="px-3 py-2 text-gray-300">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700 my-1" />
              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-purple-600/20 rounded-md text-gray-200 hover:text-white transition-colors"
                  onClick={() => alert("Settings functionality coming soon!")}
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-red-600/20 rounded-md text-gray-200 hover:text-white transition-colors"
                  onClick={onLogout} // <--- CHANGED THIS LINE: Now calls the onLogout prop!
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* User Level and XP Display (always visible, adjusted for mobile) */}
        <div className="text-right flex-shrink-0">
          <div className="flex items-center justify-end gap-1 mb-1">
            <span className="text-xl sm:text-2xl font-mono text-blue-400">LVL {user?.level || 1}</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm font-mono">{user?.xp || 0} XP</p>
        </div>

        {/* Mobile Menu Toggle (visible only on screens smaller than md) */}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleMobileMenu}
          className="md:hidden w-10 h-10 bg-black/40 border-white/10 backdrop-blur-sm text-gray-200 hover:text-white transition-colors flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}