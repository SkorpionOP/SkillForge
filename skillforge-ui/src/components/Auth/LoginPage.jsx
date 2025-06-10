import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/firebaseConfig';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from 'lucide-react';

// Import your image, assuming you've renamed it to logo.png and it's in the same directory
import SkillForgeLogo from './logo.png';

// --- IMPORTANT: Ensure your frontend .env is configured correctly for Vite/CRA ---
// For Vite: VITE_BACKEND_API_URL=http://localhost:5000/api
// For Create React App: REACT_APP_BACKEND_API_URL=http://localhost:5000/api
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api'; // Fallback added

// Google SVG Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Spinner component
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // After successful Firebase login, ideally you'd also register/verify with your backend
      // Similar to Google login, you'd get the ID token and send it.
      // For now, navigating directly, but consider backend integration here too.
      navigate('/');
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError("Failed to login. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const idToken = await user.getIdToken();

      // Call your backend's user registration/verification endpoint
      const response = await fetch(`${BACKEND_API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`, // Send Firebase ID token to backend
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
        }),
      });

      // Your backend returns 200 for 'user already registered' and 201 for 'new user registered'
      // If response.ok is false, it means a non-2xx status was returned (e.g., 500 error)
      if (!response.ok) {
        // Attempt to parse JSON error, but catch if it's not JSON (e.g., HTML 404 page)
        let errorData = {};
        try {
            errorData = await response.json();
        } catch (jsonErr) {
            console.error("Failed to parse error response as JSON:", jsonErr);
            throw new Error(`Server responded with non-JSON content. Status: ${response.status}`);
        }
        throw new Error(errorData.message || 'Failed to register user with backend.');
      }

      navigate('/'); // Navigate to dashboard/home on success
    } catch (err) {
      console.error("Google Login error:", err);
      // Provide more specific error messages for clarity
      if (err.message && err.message.includes("Server responded with non-JSON")) {
          setError("Server error: Received an unexpected response. Please check backend URL and server status.");
      } else if (err.code === "auth/popup-closed-by-user") {
          setError(""); // Clear error if popup was just closed by user
      } else {
          setError(err.message || "Failed to login with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer div for the grid background and flex centering
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid pattern overlay - positioned absolutely to cover the whole screen */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>

      {/* Content wrapper - relative z-index to be above the grid */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full max-w-md border border-gray-900 bg-black">
          <CardHeader className="space-y-4 text-center">
            {/* Replaced CardTitle with img tag */}
            <div className="flex justify-center">
              <img
                src={SkillForgeLogo}
                alt="SkillForge Logo"
                className="h-40 w-40" // Adjust height and width as needed
              />
            </div>
            <p className="text-sm text-neutral-300">
              Login to your account
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-center bg-gray-900 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="outline"
              className="w-full bg-black border-gray-800 hover:bg-gray-900 text-white"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <GoogleIcon />
                  CONTINUE WITH GOOGLE
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-neutral-300">OR</span>
              </div>
            </div>

            <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 bg-black border-gray-800 focus-visible:ring-gray-700 placeholder-neutral-500 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-200">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 bg-black border-gray-800 focus-visible:ring-gray-700 placeholder-neutral-500 text-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    LOGIN WITH EMAIL
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-sm text-neutral-300 justify-center">
            Don't have an account?{" "}
            <Link to="/signup"
              className="text-white px-1 h-auto underline underline-offset-4"
            >
              Sign Up
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}