"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight, Sparkles } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => i));
  }, []);

  useEffect(() => {
    // Check if user just registered
    if (searchParams.get("registered") === "true") {
      setShowSuccess(true);
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        router.push("/");
      } else {
        setError(data.message || "Invalid email or password");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-cyan-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float-particle ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Welcome Back Badge */}
        {showSuccess && (
          <div className="absolute -top-16 left-0 right-0 flex justify-center animate-slide-down">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-medium">Registration successful! Please log in.</p>
            </div>
          </div>
        )}

        {/* Logo/Brand */}
        <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-blue-600 to-cyan-500 text-white text-3xl font-bold shadow-xl mb-4 rotate-3 hover:rotate-0 transition-transform">
            🌍
          </div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-600">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your journey
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-3xl sm:px-10 border border-white/30 relative overflow-hidden group">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500 to-cyan-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 text-gray-700 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700 ml-1">
                  Password
                </label>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-4 text-gray-700 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-shake">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-4 border-2 border-transparent text-base font-semibold rounded-2xl text-white bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group/btn relative overflow-hidden"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>

              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/user/register"
              className="font-semibold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(30px, -20px) scale(1.1);
          }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes float-particle {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          100% {
            transform: translateY(-100px) translateX(100px);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}