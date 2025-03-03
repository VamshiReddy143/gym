"use client";

import { useUserId } from '@/app/hooks/useUserId';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';

const EditProfilePage = () => {
    const userId = useUserId();
    const [userData, setUserData] = useState({
        name: '',
        location: '',
        gender: '',
        email: '',
        phonenumber: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const response = await fetch(`/api/profile?userId=${userId}`);
                const data = await response.json();
                if (data.success) {
                    setUserData({
                        name: data.user.name || '',
                        location: data.user.Address || '',
                        gender: data.user.gender || '',
                        email: data.user.email || '',
                        phonenumber: data.user.phonenumber || '',
                        image: data.user.image || ''
                    });
                } else {
                    console.error("Failed to fetch user data:", data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Current userData before submit:", userData);
        try {
            const payload = { userId, ...userData };
            console.log("Submitting data:", payload);
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            console.log("Response from server:", result);
            if (response.ok) {
                window.location.href = '/profile';
            } else {
                console.error("Failed to update profile:", result);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleImageUpload = (results: CloudinaryUploadWidgetResults) => {
        console.log("Full Cloudinary result:", results);
        // Check if it's a success event with info
        if (results.event === "success" && results.info && typeof results.info === "object" && "secure_url" in results.info) {
            const newImageUrl = results.info.secure_url as string;
            console.log("New image URL:", newImageUrl);
            setUserData(prev => {
                const updatedData = { ...prev, image: newImageUrl };
                console.log("Updated userData after upload:", updatedData);
                return updatedData;
            });
            setUploadError(null);
        } else {
            console.error("Upload failed or no secure_url:", results);
            setUploadError("Failed to upload image. Please try again.");
        }
    };

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10">
            <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
            {uploadError && (
                <p className="text-red-500 mb-4">{uploadError}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center">
                    <CldUploadWidget
                        uploadPreset="gym_website"
                        onSuccess={handleImageUpload}
                        onError={(error) => {
                            console.error("Cloudinary upload error:", error);
                            setUploadError("Upload error: " + (error || "Unknown error"));
                        }}
                        options={{
                            maxFiles: 1,
                            resourceType: "image",
                            clientAllowedFormats: ["png", "jpg", "jpeg"],
                            maxFileSize: 5000000,
                            folder: "profile_pictures"
                        }}
                    >
                        {({ open }) => (
                            <div className="relative cursor-pointer" onClick={() => open()}>
                                <Image
                                    src={userData.image || "https://imgs.search.brave.com/jDRn2PRE1fbtjxX1wxqOilFWACcMOCjTuxl32xMbb9M/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9paHgwYThj/aGlmcGMvZ1B5SEtE/R0kwbWQ0TmtSRGpz/NGs4LzM2YmUxZTcz/MDA4YTAxODFjMTk4/MGY3MjdmMjlkMDAy/L2F2YXRhci1wbGFj/ZWhvbGRlci1nZW5l/cmF0b3ItNTAweDUw/MC5qcGc_dz0xOTIw/JnE9NjAmZm09d2Vi/cA"}
                                    alt="Profile"
                                    width={150}
                                    height={150}
                                    className="rounded-full border-4 h-[10em] w-[10em] object-cover border-orange-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                                    <span className="text-white">Change Photo</span>
                                </div>
                            </div>
                        )}
                    </CldUploadWidget>
                </div>

                <div>
                    <label className="block text-lg font-medium">Name</label>
                    <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="w-full p-2 mt-1 rounded border border-gray-600 bg-gray-800 text-white"
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium">Location</label>
                    <input
                        type="text"
                        value={userData.location}
                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                        className="w-full p-2 mt-1 rounded border border-gray-600 bg-gray-800 text-white"
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium">Gender</label>
                    <select
                        value={userData.gender}
                        onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                        className="w-full p-2 mt-1 rounded border border-gray-600 bg-gray-800 text-white"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-lg font-medium">Email</label>
                    <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="w-full p-2 mt-1 rounded border border-gray-600 bg-gray-800 text-white"
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium">Phone Number</label>
                    <input
                        type="tel"
                        value={userData.phonenumber}
                        onChange={(e) => setUserData({ ...userData, phonenumber: e.target.value })}
                        className="w-full p-2 mt-1 rounded border border-gray-600 bg-gray-800 text-white"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfilePage;