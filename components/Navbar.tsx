"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Menu, 
  X, 
  Home, 
  Compass, 
  PlusCircle, 
  LogIn, 
  LogOut, 
  User,
  ChevronDown,
  Bell,
  Sparkles
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowUserMenu(false);
    setIsMenuOpen(false);
    router.push("/user/login");
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/user/feed", label: "Explore", icon: Compass },
  ];

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? "bg-gray-900/95 backdrop-blur-xl shadow-2xl py-3" 
          : "bg-gray-900 py-4"
        }
      `}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="group relative">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-cyan-500 transition-all">
                  Travel
                </span>
                <span className="text-white group-hover:text-gray-200 transition-colors">
                  Exp
                </span>
              </h1>
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? "text-blue-400 bg-blue-400/10" 
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                      }
                      group overflow-hidden
                    `}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </span>
                    {isActive && (
                      <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-cyan-600/20 animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  {/* Notification Bell */}
                  <button className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </button>

                  {/* Create Button */}
                  <Link
                    href="/user/create_listings"
                    className="group relative flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-medium text-sm hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 hover:shadow-xl overflow-hidden"
                  >
                    <PlusCircle className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                    <span>Create</span>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                        U
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden animate-slide-down">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm font-medium text-white">John Doe</p>
                          <p className="text-xs text-gray-400">john@example.com</p>
                        </div>
                        <Link
                          href="/user/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/user/register"
                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                  >
                    Register
                  </Link>
                  <Link
                    href="/user/login"
                    className="group relative flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-medium text-sm hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 hover:shadow-xl overflow-hidden"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                    <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`
          md:hidden absolute left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 shadow-2xl
          transition-all duration-300 overflow-hidden
          ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}>
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isActive 
                        ? "bg-blue-600/20 text-blue-400" 
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Section */}
            {isLoggedIn ? (
              <div className="space-y-2 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                    U
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">John Doe</p>
                    <p className="text-xs text-gray-400">john@example.com</p>
                  </div>
                </div>

                <Link
                  href="/user/create_listings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="font-medium">Create Experience</span>
                </Link>

                <Link
                  href="/user/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-4 border-t border-gray-800">
                <Link
                  href="/user/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Register</span>
                </Link>

                <Link
                  href="/user/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="font-medium">Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}