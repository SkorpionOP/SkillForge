import React from "react";
import { Button } from "@/components/ui/button";
import { X, User, LogOut, LayoutList, PlusCircle, Settings } from "lucide-react";

export default function MobileMenu({
  backendUser,
  currentUser,
  isMobileMenuOpen,
  mobileMenuRef,
  closeMobileMenu,
  setCurrentView,
  handleLogout,
}) {
  if (!isMobileMenuOpen) return null;

  const displayName =
    backendUser?.name ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  return (
    <>
      {/* Sidebar */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-y-0 right-0 w-64 bg-gray-900 border-l border-gray-700 z-[999] shadow-lg
                  transform transition-transform duration-300 ease-in-out translate-x-0"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">Menu</h2>
          <Button variant="ghost" size="icon" onClick={closeMobileMenu} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-md mb-4 mx-4">
          <User className="w-6 h-6 text-purple-400" />
          <div>
            <span className="text-gray-100 font-semibold">{displayName}</span>
            <p className="text-gray-400 text-sm">
              LVL {backendUser?.level || 1} • {backendUser?.xp || 0} XP
            </p>
          </div>
        </div>

        {/* Menu Buttons */}
        <nav className="flex flex-col p-4 space-y-2">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentView("roadmapsList");
              closeMobileMenu();
            }}
            className="w-full justify-start text-left text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <LayoutList className="mr-2 h-4 w-4" />
            View My Roadmaps
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setCurrentView("generator");
              closeMobileMenu();
            }}
            className="w-full justify-start text-left text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate New Roadmap
          </Button>

          <div className="border-t border-gray-700 my-2 pt-2" />

          <Button
            variant="ghost"
            onClick={() => {
              alert("Settings coming soon!");
              closeMobileMenu();
            }}
            className="w-full justify-start text-left text-gray-200 hover:bg-purple-600/20 hover:text-white px-3 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-left text-red-400 hover:bg-red-600/20 hover:text-red-300 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </nav>
      </div>

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[998] md:hidden"
        onClick={closeMobileMenu}
      />
    </>
  );
}
