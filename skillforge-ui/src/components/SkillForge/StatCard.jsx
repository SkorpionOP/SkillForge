import { Card, CardContent } from "@/components/ui/card"; // Assuming these are from your UI library

export default function StatCard({ title, value, icon: IconComponent }) {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200 text-sm font-mono mb-1">{title}</p>
            {/* ADDED text-white to make the value visible */}
            <p className="text-2xl font-mono text-white">{value}</p>
          </div>
          {IconComponent && <IconComponent className="w-5 h-5 text-white/60" />}
        </div>
      </CardContent>
    </Card>
  );
}