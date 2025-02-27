"use client";

import { useUserId } from '@/app/hooks/useUserId';
import { motion } from 'framer-motion';
import { PencilIcon, RefreshCcwIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';

const Page = () => {
    const userId = useUserId();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [challenges, setChallenges] = useState<any[]>([]);

    useEffect(() => {
        if (!userId) return;
        fetch('/api/challenges', { headers: { userId } })
            .then((res) => res.json())
            .then((data) => setChallenges(data.challenges));
    }, [userId]);



    const completeChallenge = async (challengeId: string) => {
        await fetch(`/api/challenges/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, challengeId }),
        });

        setChallenges((prev) =>
            prev.map((ch) =>
                ch._id === challengeId ? { ...ch, completed: true } : ch
            )
        );
        setUserData((prev: any) => ({
            ...prev,
            completedChallenges: [...(prev?.completedChallenges || []), challengeId],
        }));
    };

    const fetchUserData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/profile?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user data');
            const data = await response.json();
            if (data.success) setUserData(data.user);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen bg-black">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="w-20 h-20 border-8 border-t-red-600 border-orange-600/50 rounded-full shadow-[0_0_25px_rgba(255,0,0,0.7)]"
                >
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
                        💪
                    </span>
                </motion.div>
            </div>
        );
    if (!userData)
        return (
            <p className="text-center text-gray-300 text-3xl font-extrabold bg-black min-h-screen flex items-center justify-center uppercase tracking-wider">
                User Not Found
            </p>
        );

    return (
        <div className="min-h-screen bg-black text-white px-8 py-16 overflow-hidden relative">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,0,0,0.3),_transparent_60%)] pointer-events-none opacity-70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,165,0,0.3),_transparent_60%)] pointer-events-none opacity-70" />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-10 pointer-events-none" /> {/* Optional: Add subtle gym texture */}

            {/* Header */}
            <motion.h1
                initial={{ opacity: 0, y: -80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', type: 'spring', stiffness: 100 }}
                className="text-6xl md:text-8xl font-extrabold text-center mb-20 tracking-tighter uppercase relative"
            >
                <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
                    {userData.name}
                </span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="block text-3xl md:text-4xl mt-4 text-gray-300 font-bold tracking-wide"
                >
                    Dominate Your Destiny 💪
                </motion.span>
                <motion.div
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 h-1 w-1/2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                />
            </motion.h1>

            <div className="max-w-7xl mx-auto space-y-16">
                {/* Profile & Stats */}
                <motion.div
                    initial={{ opacity: 0, x: -150 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.2, type: 'spring', stiffness: 80 }}
                    className="bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-red-900/60 p-10 rounded-3xl shadow-[0_0_30px_rgba(255,0,0,0.4)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_80%)] opacity-40 pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: 3 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative flex-shrink-0"
                        >
                            <Image
                                src={
                                    userData.image ||
                                    'https://imgs.search.brave.com/jDRn2PRE1fbtjxX1wxqOilFWACcMOCjTuxl32xMbb9M/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9paHgwYThj/aGlmcGMvZ1B5SEtE/R0kwbWQ0TmtSRGpz/NGs4LzM2YmUxZTcz/MDA4YTAxODFjMTk4/MGY3MjdmMjlkMDAy/L2F2YXRhci1wbGFj/ZWhvbGRlci1nZW5l/cmF0b3ItNTAweDUw/MC5qcGc_dz0xOTIw/JnE9NjAmZm09d2Vi/cA'
                                }
                                alt="Profile"
                                width={180}
                                height={180}
                                className="rounded-full h-[200px] w-[200px] object-cover border-6 border-gradient-to-r from-red-600 to-orange-600 shadow-[0_0_20px_rgba(255,165,0,0.6)]"
                            />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-[0_0_10px_rgba(255,0,0,0.7)]"
                            >
                                {userData.gender === 'male' ? '♂️' : userData.gender === 'female' ? '♀️' : '⚡'}
                            </motion.div>
                        </motion.div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex justify-between items-center">
                                <h2 className="text-5xl font-extrabold text-white uppercase tracking-wider drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                                    {userData.name}
                                </h2>
                                <Link href="/profile/edit" className="group">
                                    <PencilIcon className="h-8 w-8 text-gray-400 group-hover:text-orange-500 transition-colors shadow-[0_0_5px_rgba(255,165,0,0.5)]" />
                                </Link>
                            </div>
                            <p className="text-2xl text-gray-400 mt-3 italic font-semibold">
                                Forging Greatness Since {new Date(userData.createdAt).getFullYear()} {new Date(userData.createdAt).toLocaleString('en-US', { month: 'long' })}
                            </p>

                            {userData.awards?.length > 0 && (
                                <div className="flex gap-6 mt-8 justify-center md:justify-start">
                                    {userData.awards.map((award: string, index: number) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="relative"
                                        >
                                            <Image
                                                src={award}
                                                alt="Award"
                                                width={80}
                                                height={90}
                                                className="object-contain drop-shadow-[0_0_10px_rgba(255,165,0,0.8)]"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="h-1 w-3/4 mx-auto bg-gradient-to-r from-red-600 via-orange-500 to-transparent my-10 rounded-full shadow-[0_0_5px_rgba(255,0,0,0.5)]" />
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <motion.div
                            whileHover={{ scale: 1.15, y: -5 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 cursor-pointer rounded-2xl shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                        >
                            <h3 className="text-xl font-bold text-red-500 uppercase">Total Spent</h3>
                            <p className="text-4xl font-extrabold text-white mt-2 tracking-tight">$894</p>
                        </motion.div>
                        <Link href={"/orders"}>
                        <motion.div
                            whileHover={{ scale: 1.15, y: -5 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                        >
                            <h3 className="text-xl font-bold text-orange-500 uppercase">Orders</h3>
                            <p className="text-4xl font-extrabold text-white mt-2 tracking-tight">15</p>
                        </motion.div>
                        </Link>
                        <motion.div
                            whileHover={{ scale: 1.15, y: -5 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                        >
                            <h3 className="text-xl font-bold text-yellow-500 uppercase">Streak</h3>
                            <p className="text-4xl font-extrabold text-white mt-2 tracking-tight">
                                🔥 {userData.streak}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Address Card */}
                <motion.div
                    initial={{ opacity: 0, x: 150 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.3, type: 'spring', stiffness: 80 }}
                    className="bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-orange-900/60 p-10 rounded-3xl shadow-[0_0_30px_rgba(255,165,0,0.4)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,165,0,0.2),_transparent_80%)] opacity-40 pointer-events-none" />
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h2 className="text-4xl font-extrabold text-white uppercase tracking-wider drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]">
                            Your Headquarters
                        </h2>
                        <Link href="/profile/edit" className="group">
                            <PencilIcon className="h-8 w-8 text-gray-400 group-hover:text-red-600 transition-colors shadow-[0_0_5px_rgba(255,0,0,0.5)]" />
                        </Link>
                    </div>
                    <div className="space-y-8 text-xl relative z-10">
                        <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl">
                            <strong className="text-red-500 font-bold uppercase">Location:</strong>
                            <p className="text-gray-200 font-semibold">
                                {userData.Address || 'Set your base'}
                            </p>
                        </div>
                        <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl">
                            <strong className="text-orange-500 font-bold uppercase">Email:</strong>
                            <p className="text-gray-200 font-semibold">{userData.email}</p>
                        </div>
                        <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl">
                            <strong className="text-yellow-500 font-bold uppercase">Phone:</strong>
                            <p className="text-gray-200 font-semibold">
                                {userData.phonenumber || '+1234567890'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Subscription Card */}
                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.4, type: 'spring', stiffness: 80 }}
                    className="bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-red-900/60 p-10 rounded-3xl shadow-[0_0_30px_rgba(255,0,0,0.4)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_80%)] opacity-40 pointer-events-none" />
                    {userData.subscription && (userData.subscription.planName || userData.subscription.plan || userData.subscription.startDate) ? (
                        <div className="relative z-10">
                            <h2 className="text-4xl font-extrabold text-white uppercase tracking-wider mb-8 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                                Your Elite Membership
                            </h2>
                            <div className="flex flex-col md:flex-row items-center gap-10">
                                <div className="space-y-6 flex-1 text-center md:text-left">
                                    <p className="text-2xl">
                                        <span className="text-red-500 font-bold uppercase">Plan:</span>{' '}
                                        <span className="text-white font-extrabold tracking-tight">
                                            {userData.subscription.planName || userData.subscription.plan || "Free Membership"}
                                            {userData.subscription.price === 0 && (
                                                <span className="ml-2 px-2 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">Free</span>
                                            )}
                                        </span>
                                    </p>
                                    <p className="text-2xl">
                                        <span className="text-orange-500 font-bold uppercase">Expires:</span>{' '}
                                        <span className="text-gray-200 font-semibold">
                                            {userData.subscription.endDate ? new Date(userData.subscription.endDate).toLocaleDateString() : "N/A"}
                                        </span>
                                    </p>
                                    <p className="text-2xl">
                                        <span className="text-yellow-500 font-bold uppercase">Started:</span>{' '}
                                        <span className="text-gray-200 font-semibold">
                                            {userData.subscription.startDate ? new Date(userData.subscription.startDate).toLocaleDateString() : "N/A"}
                                        </span>
                                    </p>
                                    <p className="text-2xl">
                                        <span className="text-red-500 font-bold uppercase">Price:</span>{' '}
                                        <span className="text-gray-200 font-semibold">
                                            ${userData.subscription.price ?? 0}
                                        </span>
                                    </p>
                                    <p className="text-2xl">
                                        <span className="text-red-500 font-bold uppercase">Email:</span>{' '}
                                        <span className="text-gray-200 font-semibold">{userData.email}</span>
                                    </p>
                                </div>
                                {userData.subscription.qrCode && userData.subscription.qrCode.startsWith("data:image") ? (
                                    <motion.div
                                        whileHover={{ scale: 1.15, rotate: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative flex-shrink-0"
                                    >
                                        <Image
                                            src={userData.subscription.qrCode}
                                            alt="QR Code"
                                            width={180}
                                            height={180}
                                            className="rounded-2xl border-6 border-gradient-to-r from-red-600 to-orange-600 shadow-[0_0_20px_rgba(255,165,0,0.6)]"
                                        />
                                    </motion.div>
                                ) : (
                                    <p className="text-gray-400 italic">No QR Code available</p>
                                )}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={fetchUserData}
                                className="mt-6 px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-full shadow-[0_0_10px_rgba(255,0,0,0.4)]"
                            >
                                <RefreshCcwIcon />
                            </motion.button>
                        </div>
                    ) : (
                        <div className="text-center py-12 relative z-10">
                            <h2 className="text-5xl font-extrabold text-white uppercase tracking-wider animate-pulse drop-shadow-[0_0_15px_rgba(255,0,0,0.7)]">
                                Unleash Your Potential
                            </h2>
                            <p className="text-2xl text-gray-300 mt-6 font-semibold">
                                No active plan—time to power up!
                            </p>
                            <Link
                                href="/subscribe"
                                className="mt-8 inline-block px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xl font-extrabold uppercase rounded-full hover:from-red-700 hover:to-orange-700 transition-all shadow-[0_0_20px_rgba(255,0,0,0.6)] hover:shadow-[0_0_30px_rgba(255,165,0,0.8)]"
                            >
                                Join the Elite Now
                            </Link>
                            {/* <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={fetchUserData}
                                className="mt-6  px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-full shadow-[0_0_10px_rgba(255,0,0,0.4)]"
                            >
                                <RefreshCcwIcon/>
                            </motion.button> */}
                        </div>
                    )}
                </motion.div>
                {/* Challenges Section */}
                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.5, type: 'spring', stiffness: 80 }}
                >
                    <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-12 uppercase tracking-tighter text-center relative">
                        <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
                            Today’s Battleground
                        </span>
                        <motion.div
                            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 w-1/3 bg-gradient-to-r from-red-600 to-orange-600 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        />
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {challenges && challenges.map((challenge, index) => (
                            <motion.div
                                key={challenge._id}
                                initial={{ opacity: 0, scale: 0.85, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index, type: 'spring', stiffness: 90 }}
                                className="relative bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-orange-900/60 p-8 rounded-3xl shadow-[0_0_25px_rgba(255,0,0,0.4)] hover:shadow-[0_0_40px_rgba(255,165,0,0.6)] transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,165,0,0.2),_transparent_80%)] opacity-50 pointer-events-none" />
                                <h4 className="text-3xl font-extrabold text-white uppercase tracking-wide relative z-10 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">
                                    {challenge.name}
                                </h4>
                                <p className="text-gray-300 mt-3 text-lg font-semibold relative z-10">
                                    {challenge.description}
                                </p>
                                <p className="mt-4 text-2xl font-bold text-yellow-400 relative z-10">
                                    🎯 {challenge.points} PTS
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255,165,0,0.8)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => completeChallenge(challenge._id)}
                                    disabled={
                                        challenge.completed ||
                                        userData.completedChallenges?.includes(challenge._id)
                                    }
                                    className={`mt-6 w-full py-4 px-6 rounded-full text-xl font-extrabold uppercase tracking-wider transition-all duration-200 relative z-10 ${userData.completedChallenges?.includes(challenge._id)
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-[0_0_15px_rgba(255,0,0,0.6)]'
                                        }`}
                                >
                                    {userData.completedChallenges?.includes(challenge._id)
                                        ? '✅ Vanquished'
                                        : '⚡ Conquer Now'}
                                </motion.button>
                                {userData.completedChallenges?.includes(challenge._id) && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0, rotate: -45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute -top-4 -right-4 bg-gradient-to-r from-green-600 to-green-400 text-white text-sm font-bold px-4 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,0,0.6)] transform rotate-12"
                                    >
                                        Victory ✅
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Page;