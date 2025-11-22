"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, Building, MapPin, Globe, User, Hash } from "lucide-react";

const fetchUser = async (id: string) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">User Not Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!user) return null;

  const fullAddress = `${user.address.street}, ${user.address.city}, ${user.address.zipcode}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button Card */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Users</span>
          </button>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden mb-6">
          
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-2 border-white/30 shadow-lg">
                {getInitials(user.name)}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-blue-100 text-lg opacity-90">{user.company.name}</p>
                <p className="text-blue-200 text-sm mt-1 opacity-75">{user.company.catchPhrase}</p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Personal Info */}
              <div className="space-y-6">
                
                {/* Contact Card */}
                <div className="bg-gray-50/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl hover:bg-white/70 dark:hover:bg-gray-600/50 transition-colors">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl hover:bg-white/70 dark:hover:bg-gray-600/50 transition-colors">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Card */}
                <div className="bg-gray-50/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-purple-500" />
                    Company Details
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.company.name}</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Catch Phrase</p>
                      <p className="font-medium text-gray-900 dark:text-white italic">{user.company.catchPhrase}</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Business</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.company.bs}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Address & Additional Info */}
              <div className="space-y-6">
                
                {/* Address Card */}
                <div className="bg-gray-50/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Address Information
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/50 dark:bg-gray-600/30 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Full Address</p>
                      <p className="font-medium text-gray-900 dark:text-white">{fullAddress}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Street</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.address.street}</p>
                      </div>
                      <div className="p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.address.city}</p>
                      </div>
                      <div className="p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Zipcode</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.address.zipcode}</p>
                      </div>
                      <div className="p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Suite</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.address.suite}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Card */}
                <div className="bg-gray-50/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Hash className="w-5 h-5 text-gray-500" />
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl text-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl text-center">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                      <p className="font-medium text-blue-600 dark:text-blue-400">{user.website}</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-gray-600/30 rounded-xl text-center col-span-2">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Hash className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                      <p className="font-medium text-gray-900 dark:text-white text-lg">{user.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}