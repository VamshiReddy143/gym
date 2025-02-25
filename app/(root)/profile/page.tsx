"use client";

import { useUserId } from '@/app/hooks/useUserId';
import { motion } from 'framer-motion';
import { p } from 'framer-motion/client';
import { PencilIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';

const Page = () => {
    const userId = useUserId();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [challenges, setChallenges] = useState([]);

    console.log(userData)

    useEffect(() => {
        if (!userId) return;
        fetch('/api/challenges', { headers: { userId } })
            .then(res => res.json())
            .then(data => setChallenges(data.challenges));
    }, [userId]);


    const completeChallenge = async (challengeId) => {
        await fetch(`/api/challenges/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, challengeId }),
        });

        setChallenges(prev =>
            prev.map(ch =>
                ch._id === challengeId ? { ...ch, completed: true } : ch
            )
        );
        setUserData(prev => ({
            ...prev,
            completedChallenges: [...prev?.completedChallenges, challengeId],
        }));
    };

    const fetchUserData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/profile?userId=${userId}`);
            if (!response.ok) throw new Error("Failed to fetch user data");
            const data = await response.json();

            if (data.success) {
                setUserData(data.user);
            }
           

        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (loading) return <p>Loading...</p>;
    if (!userData) return <p>User not found</p>;

    console.log(userData.gender)

    return (
        <div className='mb-[10em] px-6'>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className='font-extrabold text-4xl py-7 text-center'>
                Hello <strong className='text-orange-500'>{userData.name}👋</strong>
            </motion.h1>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-900 border border-gray-400 p-7 w-full rounded-xl shadow-xl"
                >
                    <div className="flex items-center gap-8">
                        <Image
                            src={userData.image || "https://imgs.search.brave.com/jDRn2PRE1fbtjxX1wxqOilFWACcMOCjTuxl32xMbb9M/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9paHgwYThj/aGlmcGMvZ1B5SEtE/R0kwbWQ0TmtSRGpz/NGs4LzM2YmUxZTcz/MDA4YTAxODFjMTk4/MGY3MjdmMjlkMDAy/L2F2YXRhci1wbGFj/ZWhvbGRlci1nZW5l/cmF0b3ItNTAweDUw/MC5qcGc_dz0xOTIw/JnE9NjAmZm09d2Vi/cA"}
                            alt="Profile"
                            width={900}
                            height={900}
                            className="rounded-full h-[10em] w-[10em] object-cover border-4 border-orange-500"
                        />
                        <div className="w-full">
                            <div className="flex items-center justify-between">
                               <div className='flex gap-2 items-center'>
                               <p className="font-bold text-4xl">{userData.name}</p>
                                {userData.gender === "male" ? (
                                    <p  className='text-4xl font-extrabold '>♂️</p>
                                ) : (
                                    <p className='text-4xl '>♀️</p>
                                )
                                }
                               </div>
                                <Link href="/profile/edit" className="cursor-pointer">
                                    <PencilIcon className="h-6 w-6 text-gray-400 hover:text-orange-500" />
                                </Link>
                            </div>
                            <p className="text-2xl text-gray-400">Joined 3 months ago</p>

                            {userData.awards?.length > 0 && (
                                <div className="flex gap-2 flex-wrap mt-7">
                                    {userData.awards.map((award, index) => (
                                        <Image
                                            key={index}
                                            src={award}
                                            alt="Award"
                                            width={900}
                                            height={900}
                                            className="h-[70px] w-[60px] object-contain"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-gray-300 my-6" />
                    <div className="flex justify-around">
                        <div className="text-center">
                            <h1 className="font-bold text-xl">Total Spent</h1>
                            <h1 className="text-2xl font-bold text-green-400">$894</h1>
                        </div>
                        <div className="text-center">
                            <h1 className="font-bold text-xl">Orders</h1>
                            <h1 className="text-2xl font-bold text-blue-400">15</h1>
                        </div>
                        <div className="text-center">
                            <h1 className="font-bold text-xl">Streak</h1>
                            <h1 className="text-2xl font-bold text-yellow-400">🔥{userData.streak}</h1>
                        </div>
                    </div>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="border border-gray-500 p-7 w-full rounded-xl shadow-xl"
                >
                    <div className="flex justify-between items-center mb-5">
                        <h1 className="font-bold text-4xl">Default Address</h1>

                        <Link href="/profile/edit" className="hover:text-orange-500">
                            <PencilIcon className="h-6 w-6 text-gray-400 hover:text-orange-500" />
                        </Link>
                    </div>

                    <div className="flex justify-between py-4">
                        <strong className="text-2xl">Location:</strong>
                        <p className="text-xl">{userData.Address}</p>
                    </div>
                    <div className="flex justify-between items-start py-4">
                        <strong>Email:</strong>
                        <p className="text-xl">{userData.email}</p>
                    </div>
                    <div className="flex justify-between items-start py-4">
                        <strong>Phone:</strong>
                        <p className="text-xl">{userData.phonenumber || "+1234567890"}</p>
                    </div>
                </motion.div>

            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='border border-gray-500 p-7 w-full rounded-xl mt-10 shadow-xl'>
                {userData.subscription && userData.subscription.plan ? (
                    <div className='p-6'>
                        <h2 className='text-4xl font-bold border-b border-orange-300 w-fit py-2'>Active Subscription</h2>
                        <div className='flex items-center gap-10 mt-5'>
                            <div className='flex flex-col gap-2'>
                                <p className='text-xl font-mono'>Current Plan: <strong className='text-orange-700 text-3xl'>{userData.subscription.plan}</strong></p>
                                <p className='text-xl font-mono'>Expires: <strong>{new Date(userData.subscription.endDate).toLocaleDateString()}</strong></p>
                                <p className='text-xl font-mono'>Started In: <strong>{new Date(userData.subscription.startDate).toLocaleDateString()}</strong></p>
                                <p className='text-lg font-mono'>Email: <strong className='text-blue-400'>{userData.email}</strong></p>
                            </div>
                            {userData.subscription.qrCode && (
                                <Image src={userData.subscription.qrCode} alt="QR Code" width={150} height={150} className='rounded-lg border-2 border-gray-300' />
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className='text-xl text-red-500'>No active subscription</p>
                        <p className='text-lg'>Please subscribe to a plan to access the gym</p>
                    </div>
                )}

            </motion.div>

            <div className="p-6">
                <h2 className="text-3xl font-bold">Today's Challenges</h2>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-10 p-6 rounded-xl shadow-xl border border-gray-700 bg-gray-900/50 backdrop-blur-lg"
                >
                    <h2 className="text-4xl font-extrabold text-orange-400 mb-5">🔥 Today&apos;s Challenges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {challenges.map((challenge) => (
                            <motion.div
                                key={challenge._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="relative p-6 border border-gray-700 rounded-xl shadow-lg bg-gray-800/80 backdrop-blur-md hover:scale-[1.02] transition-transform"
                            >
                                <h3 className="text-2xl font-bold text-orange-300">{challenge.name}</h3>
                                <p className="text-gray-300">{challenge.description}</p>
                                <p className="mt-2 text-lg font-semibold text-green-400">🎯 Points: {challenge.points}</p>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => completeChallenge(challenge._id)}
                                    disabled={challenge.completed || userData.completedChallenges.includes(challenge._id)}
                                    className={`mt-4 py-2 px-4 w-full rounded-lg text-lg font-bold transition-all ${userData.completedChallenges.includes(challenge._id)
                                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-orange-500 to-orange-700 text-white hover:opacity-90"
                                        }`}
                                >
                                    {userData.completedChallenges.includes(challenge._id) ? "✅ Completed" : "⚡ Complete"}
                                </motion.button>

                                {userData.completedChallenges.includes(challenge._id) && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="absolute top-3 right-3 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full"
                                    >
                                        Done ✅
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
