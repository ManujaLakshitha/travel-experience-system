"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    MapPin,
    DollarSign,
    Calendar,
    User,
    Edit,
    Trash2,
    ArrowLeft,
    Share2,
    Heart,
    Star,
    Clock,
    CheckCircle,
    AlertTriangle,
    X
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { jwtDecode } from "jwt-decode";

dayjs.extend(relativeTime);

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [listing, setListing] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    let currentUserId = "";

    if (token) {
        const decoded: any = jwtDecode(token);
        currentUserId = decoded.userId;
    }

    useEffect(() => {
        fetch("/api/listings")
            .then(res => res.json())
            .then(data => {
                const item = data.find((i: any) => i._id === id);
                setListing(item);
                setIsLoading(false);
            })
            .catch(err => {
                setError("Failed to load listing");
                setIsLoading(false);
            });
    }, [id]);

    const deleteListing = async () => {
        setIsDeleting(true);
        try {
            await fetch(`/api/listings/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: currentUserId
                })
            });
            router.push("/");
        } catch (err) {
            setError("Failed to delete listing");
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    // Loading Skeleton
    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        {/* Back Button Skeleton */}
                        <div className="h-10 w-24 bg-gray-200 rounded-lg mb-6"></div>

                        {/* Image Skeleton */}
                        <div className="w-full h-100 bg-gray-200 rounded-2xl mb-8"></div>

                        {/* Content Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-40 bg-gray-200 rounded-xl"></div>
                                <div className="h-12 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !listing) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error || "Listing not found"}</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-gray-700 rounded-xl hover:bg-blue-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Feed
                    </Link>
                </div>
            </div>
        );
    }

    console.log("Current User ID:", currentUserId);
    console.log("Listing Creator ID:", listing?.creator?._id);

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="group mb-6 text-gray-700 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                    <ArrowLeft className="h-4 w-4 text-gray-700 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Feed</span>
                </button>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1">
                    {/* Left Column - Image and Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="relative group">
                            <div className="relative h-100 rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={listing.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop"}
                                    alt={listing.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Image Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

                                {/* Price Badge */}
                                {listing.price && (
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-lg font-bold text-blue-600 shadow-lg">
                                        ${listing.price}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title and Basic Info */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                                {listing.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-5 w-5 text-blue-500" />
                                    <span>{listing.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-5 w-5 text-green-500" />
                                    <span>{dayjs(listing.createdAt).format("MMMM D, YYYY")}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-5 w-5 text-purple-500" />
                                    <span>{dayjs(listing.createdAt).fromNow()}</span>
                                </div>
                            </div>

                            {/* Creator Info */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {listing.creator?.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Posted by</p>
                                    <p className="font-semibold text-gray-800">{listing.creator?.name || "Anonymous"}</p>
                                </div>
                                {listing.creator?.verified && (
                                    <CheckCircle className="h-5 w-5 text-blue-500 ml-auto" />
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">About this experience</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {listing.description}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl sticky top-24">

                                {/* Action Buttons */}
                                <div className="space-y-3">

                                    {listing && (String(currentUserId) === String(listing.creator?._id || listing.creator)) && (
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Listing
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Delete Listing</h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-center mb-4">
                                <AlertTriangle className="h-16 w-16 text-red-500" />
                            </div>
                            <p className="text-gray-600 text-center">
                                Are you sure you want to delete this listing? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteListing}
                                disabled={isDeleting}
                                className="flex-1 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}