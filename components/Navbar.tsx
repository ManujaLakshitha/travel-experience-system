"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/user/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg px-6 md:px-12">
      <Link href="/">
        <h1 className="text-2xl font-extrabold tracking-tight text-blue-400 cursor-pointer">
          Travel<span className="text-white">Exp</span>
        </h1>
      </Link>

      <div className="flex items-center space-x-6">
        <Link href="/user/feed" className="hover:text-blue-400 transition">Feed</Link>
        
        {isLoggedIn ? (
          <>
            <Link href="/user/create_listings" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition text-sm font-medium">
              + Create
            </Link>
            <button 
              onClick={logout}
              className="text-gray-300 hover:text-red-400 transition text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/user/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition text-sm font-medium">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}