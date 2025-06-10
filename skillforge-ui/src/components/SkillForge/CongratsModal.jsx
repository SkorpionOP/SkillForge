import React from "react";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CongratsModal({ skillName, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-4">
      <div className="bg-gradient-to-br from-purple-800 to-blue-900 border border-purple-600 rounded-lg p-8 shadow-2xl text-center max-w-md w-full animate-fade-in-up">
        <Award className="w-16 h-16 text-yellow-300 mx-auto mb-6 drop-shadow-lg" />
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Congratulations!</h2>
        <p className="text-lg sm:text-xl text-gray-200 mb-6">
          You have successfully completed the "{skillName}" roadmap!
        </p>
        <Button
          onClick={onClose}
          className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Awesome!
        </Button>
      </div>
    </div>
  );
}
