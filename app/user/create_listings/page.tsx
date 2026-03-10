"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Image as ImageIcon,
  MapPin,
  DollarSign,
  FileText,
  X,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function CreateListing() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (description.length < 20) newErrors.description = "Description must be at least 20 characters";
    if (image && !isValidUrl(image)) newErrors.image = "Please enter a valid URL";
    if (price && isNaN(Number(price))) newErrors.price = "Price must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImage(url);
    if (url && isValidUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {

      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ submit: "You must be logged in to create a listing." });
        setIsSubmitting(false);
        return;
      }

      const decoded: any = jwtDecode(token);

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          location,
          image: image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
          description,
          price: price ? Number(price) : null,
          creatorId: decoded.userId,
          creatorName: decoded.name,
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => router.push("/"), 2000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create listing");
      }
    } catch (error: any) {
      setErrors({ submit: error.message || "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
      </div>

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-slide-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600 mb-4">Your experience has been created successfully.</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-green-500 h-2 rounded-full animate-progress"></div>
            </div>
            <p className="text-sm text-gray-500">Redirecting to feed...</p>
          </div>
        </div>
      )}

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Feed
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 mb-2">
            Share Your Experience
          </h1>
          <p className="text-gray-600 text-lg">
            Tell the world about your amazing travel adventure
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Experience Title <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 ${errors.title ? "border-red-500" : "border-gray-200"
                      }`}
                    placeholder="e.g., Sunset Boat Tour in Bali"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.title}
                    </p>
                  )}
                </div>
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 text-gray-700 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 ${errors.location ? "border-red-500" : "border-gray-200"
                      }`}
                    placeholder="e.g., Bali, Indonesia"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Image URL Input with Preview */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Image URL
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    type="url"
                    value={image}
                    onChange={handleImageUrlChange}
                    className={`w-full pl-10 pr-4 py-3 text-gray-700 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 ${errors.image ? "border-red-500" : "border-gray-200"
                      }`}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={() => setImagePreview(null)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage("");
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {errors.image && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.image}
                  </p>
                )}
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className={`w-full pl-10 pr-4 py-3 text-gray-700 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 ${errors.description ? "border-red-500" : "border-gray-200"
                      }`}
                    placeholder="Describe your experience in detail... What makes it special? What can travelers expect?"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Minimum 20 characters
                  </p>
                  <p className={`text-xs ${description.length >= 20 ? "text-green-500" : "text-gray-400"}`}>
                    {description.length}/20
                  </p>
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Price (Optional)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 text-gray-700 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 ${errors.price ? "border-red-500" : "border-gray-200"
                      }`}
                    placeholder="e.g., 45"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative group overflow-hidden bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating your experience...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Create Experience
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Preview Card (Optional) */}
        {(title || location || description || imagePreview || price) && (
          <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview</h3>
            <div className="flex items-start gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{title || "Your Title"}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {location || "Location"}
                </p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {description || "Your description will appear here..."}
                </p>
                {price && (
                  <p className="text-sm font-semibold text-purple-600 mt-2">
                    ${price}
                  </p>
                )}
              </div>
            </div>
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
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
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
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s linear;
        }
      `}</style>
    </div>
  );
}