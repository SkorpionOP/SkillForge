import { ArrowRight, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"; // Assuming these are from your UI library

export default function GeneratorForm({ formData, setFormData, generateRoadmap, loading }) {
  // Determine if the form can be submitted (basic client-side validation)
  const isFormValid = formData.skill && formData.duration;

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-light mb-4 tracking-wide">
            SKILL<span className="font-bold">FORGE</span>
          </h1>
          <p className="text-lg text-gray-400 font-light">
            AI-Powered Learning Architecture
          </p>
        </div>

        {/* Form Card */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-6">
              {/* Target Skill Input */}
              <div>
                <label htmlFor="skill-input" className="block text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">
                  Target Skill
                </label>
                <input
                  id="skill-input"
                  type="text"
                  placeholder="Enter skill domain..."
                  value={formData.skill}
                  onChange={(e) => setFormData({...formData, skill: e.target.value})}
                  className="w-full px-4 py-4 bg-black/60 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all font-mono"
                />
              </div>

              {/* Timeline Select */}
              <div>
                <label htmlFor="duration-select" className="block text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">
                  Timeline
                </label>
                <select
                  id="duration-select"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-4 bg-black/60 border border-white/10 rounded-lg text-white focus:border-white/30 focus:outline-none transition-all font-mono"
                >
                  <option value="">Select duration...</option>
                  <option value="1 week">1 Week</option>
                  <option value="2 weeks">2 Weeks</option>
                  <option value="1 month">1 Month</option>
                  <option value="2 months">2 Months</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                </select>
              </div>

              {/* API Key field has been removed as it's handled by the backend */}
              {/* <div style={{display: 'none'}}> 
                <label className="block text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="Gemini API Key..."
                  value={formData.apiKey}
                  onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                  className="w-full px-4 py-4 bg-black/60 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all font-mono"
                />
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  Obtain from{' '}
                  <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white border-b border-white/20">
                    Google AI Studio
                  </a>
                </p>
              </div> */}
            </div>

            <button
              onClick={generateRoadmap}
              disabled={loading || !isFormValid} // Disable button if loading or form is invalid
              className="w-full py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 disabled:bg-gray-800 disabled:text-gray-500 transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  GENERATING...
                </>
              ) : (
                <>
                  INITIALIZE ROADMAP
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}