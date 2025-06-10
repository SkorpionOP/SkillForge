// src/components/SkillForge/LevelProgressBar.jsx
import { Card, CardContent } from "@/components/ui/card"; // Assuming these are from your UI library

export default function LevelProgressBar({ user }) {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-sm mb-12">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          {/* Changed text color to text-gray-100 for better visibility */}
          <h3 className="text-sm font-mono text-gray-100 uppercase tracking-wider">Level Progress</h3>
          {/* Changed text color to text-gray-200 for better visibility */}
          <span className="text-sm font-mono text-gray-200">{user.xp % 100}/100</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${(user.xp % 100)}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}