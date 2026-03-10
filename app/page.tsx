"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Search,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Grid,
  List,
  ChevronDown,
  Star,
  Heart,
  Filter,
  X
} from "lucide-react";
import Navbar from "@/components/Navbar";

dayjs.extend(relativeTime);

export default function Feed() {
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");

  // Extract unique locations for filter
  const locations = ["all", ...new Set(listings.map(item => item.location))];

  // Filter and sort listings
  const filteredListings = listings
    .filter((item: any) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());

      const matchesLocation = selectedLocation === "all" || item.location === selectedLocation;

      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "price-low") {
        return (a.price || 0) - (b.price || 0);
      } else {
        return (b.price || 0) - (a.price || 0);
      }
    });

  useEffect(() => {
    fetch("/api/listings")
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Server Error");
        }
        return res.json();
      })
      .then(data => {
        setListings(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch listings:", err.message);
        setIsLoading(false);
      });
  }, []);

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="h-10 w-64 bg-gray-200 rounded-lg mb-8"></div>

            {/* Search Skeleton */}
            <div className="h-14 bg-gray-200 rounded-xl mb-8"></div>

            {/* Filters Skeleton */}
            <div className="flex gap-3 mb-8">
              <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 mb-2">
              Travel Experiences
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Discover amazing experiences shared by our community
            </p>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-8 border border-white/20">
          {/* Search Input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, description, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-gray-700 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {/* Location Filter */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none text-gray-700 bg-white border-2 border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location === "all" ? "All Locations" : location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none text-gray-700 bg-white border-2 border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-gray-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-gray-100"
                  }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${viewMode === "list"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-gray-100"
                  }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-600">
          Found <span className="font-semibold text-blue-600">{filteredListings.length}</span> experiences
        </div>

        {/* Listings Grid/List */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No experiences found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedLocation("all");
                setSortBy("newest");
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredListings.map((item) => (
              <Link key={item._id} href={`/user/listing/${item._id}`}>
                <div className={`
                  group mb-3 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
                  transition-all duration-300 transform hover:-translate-y-2 cursor-pointer
                  ${viewMode === "list" ? "flex flex-col sm:flex-row" : ""}
                `}>
                  {/* Image Container */}
                  <div className={`
                    relative overflow-hidden
                    ${viewMode === "list" ? "sm:w-72 h-48 sm:h-auto" : "h-48"}
                  `}>
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Price Badge */}
                    {item.price && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-blue-600 shadow-lg">
                        ${item.price}
                      </div>
                    )}

                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {item.title}
                    </h2>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="text-sm line-clamp-1">{item.location}</span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                          {item.creator?.name?.charAt(0) || "U"}
                        </div>
                        <span className="text-gray-700 font-medium">
                          {item.creator?.name || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{dayjs(item.createdAt).fromNow()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}