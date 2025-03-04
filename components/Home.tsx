"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import hero1 from "@/public/gymlogo1.jpg";

// Constants
const ANIMATION_VARIANTS = {
  stat: (i: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.3, ease: "easeOut" } },
  }),
  header: { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: 0.2, ease: "easeOut", type: "spring", stiffness: 80 } },
  text: { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: 0.4, ease: "easeOut" } },
  button: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.8, delay: 0.6, ease: "easeOut", type: "spring", stiffness: 100 } },
  image: { initial: { opacity: 0, scale: 0.8, rotate: 5 }, animate: { opacity: 1, scale: 1, rotate: 0 }, transition: { duration: 1.2, delay: 0.8, ease: "easeOut", type: "spring", stiffness: 80 } },
  badge: { initial: { opacity: 0, y: 30, rotate: -10 }, animate: { opacity: 1, y: 0, rotate: 0 }, transition: { delay: 1.2, duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 } },
  gradientPulse: { animate: { opacity: [0.3, 0.6, 0.3] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
  particle: (i: number) => ({
    initial: { opacity: 0 },
    animate: {
      y: ["100%", "-50%"],
      opacity: [0, 0.8, 0],
      scale: [1, 1.5, 1],
      boxShadow: ["0 0 10px rgba(255,165,0,0.8)", "0 0 20px rgba(255,165,0,1)", "0 0 10px rgba(255,165,0,0.8)"],
    },
    transition: { duration: 4 + (i % 3), repeat: Infinity, ease: "easeOut", delay: i * 0.4 },
  }),
  spotlight: { animate: { x: ["-100%", "100%", "-100%"] }, transition: { duration: 10, repeat: Infinity, ease: "linear" } },
  overlay: { initial: { scaleX: 0 }, animate: { scaleX: 1 }, transition: { duration: 2, ease: "easeOut", delay: 1.5 } },
};

const STATS = [
  { icon: "💪", text: "25+ Years of Excellence" },
  { icon: "🏋️‍♂️", text: "Elite Training Gear" },
  { icon: "🔥", text: "100K+ Transformed Lives" },
];

// Predefined particle positions for consistency and control
const PARTICLE_POSITIONS = [
  { x: "15%", y: "85%" }, { x: "25%", y: "65%" }, { x: "35%", y: "95%" }, { x: "45%", y: "75%" },
  { x: "55%", y: "55%" }, { x: "65%", y: "90%" }, { x: "75%", y: "70%" }, { x: "85%", y: "80%" },
];



const Home: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* SEO-friendly hidden heading */}
      <h1 className="sr-only">Forge Your Ultimate Power - Gym Since 1998</h1>

      {/* Refined Background Animations */}
      {/* Single Bold Gradient */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,75,0,0.5),_transparent_70%)] pointer-events-none z-0"
        {...ANIMATION_VARIANTS.gradientPulse}
      />
      {/* Static Texture */}
      <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-15 pointer-events-none z-0" />

      {/* Glowing Particles with Trail - Client-Side Only */}
      {isClient && (
        <div className="absolute inset-0 pointer-events-none z-5">
          {PARTICLE_POSITIONS.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-orange-600 rounded-full"
              style={{ left: pos.x, bottom: pos.y }}
              {...ANIMATION_VARIANTS.particle(i)}
            />
          ))}
        </div>
      )}

      {/* Cinematic Spotlight Sweep */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        {...ANIMATION_VARIANTS.spotlight}
        style={{ background: "linear-gradient(45deg, rgba(255,165,0,0.3) 0%, transparent 50%)" }}
      />

      {/* Hero Section */}
      <div className="max-w-10xl mx-auto px-4 sm:px-8 py-10 relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
          {/* Text & CTA Section */}
          <div className="lg:w-1/2 text-center lg:text-left relative z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
              className="flex justify-center lg:justify-start items-center gap-4 mb-4 sm:mb-6"
            >
              <Image src={hero1} alt="Gym Logo" width={48} height={48} className="rounded-full" loading="lazy" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-red-500 uppercase tracking-wider">Since 1998</h2>
            </motion.div>

            <motion.h1
              {...ANIMATION_VARIANTS.header}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tighter text-white leading-tight"
            >
              Forge Your
              <span className="block bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">Ultimate Power</span>
            </motion.h1>

            <motion.p
              {...ANIMATION_VARIANTS.text}
              className="text-base sm:text-lg md:text-xl text-gray-300 font-medium mt-4 sm:mt-6 lg:w-[85%] leading-relaxed"
            >
              Transform your body and mind with elite training. Join a legacy of strength—your journey starts here.
            </motion.p>

            <motion.div {...ANIMATION_VARIANTS.button} className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <Link href="/#billing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-base sm:text-xl font-extrabold uppercase rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 relative overflow-hidden"
                  aria-label="Join Now"
                >
                  <span className="relative z-10">Join Now</span>
                  <motion.div
                    className="absolute inset-0 bg-orange-600/40"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.button>
              </Link>
              <Link href="#">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-10 py-3 sm:py-4 bg-transparent border-2 border-orange-500 text-white text-base sm:text-xl font-extrabold uppercase rounded-full hover:bg-orange-500/20 transition-all duration-300"
                  aria-label="Learn More"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>

            {/* Dynamic Gym Stats */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-8 sm:mt-12 flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-8 text-gray-300 text-sm sm:text-base md:text-lg font-semibold"
            >
              {STATS.map((stat, i) => (
                <motion.div key={i} custom={i} variants={ANIMATION_VARIANTS} className="flex items-center gap-2 sm:gap-3">
                  <span className="text-orange-500 text-xl sm:text-2xl md:text-3xl">{stat.icon}</span>
                  <span>{stat.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Image Section */}
          <div className="lg:w-1/2 relative z-20">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-xl blur-3xl z-10"
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6], rotate: [0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div {...ANIMATION_VARIANTS.image} className="relative z-20">
              <Image
                src={hero1}
                alt="Hero image showcasing gym strength training"
                width={800}
                height={800}
                className="max-w-full  h-[35rem] z-[999] sm:h-[35rem] lg:h-[50rem] object-cover rounded-xl hover:scale-105 transition-all duration-500 cursor-pointer"
                loading="lazy"
              />
              <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,165,0,0.3),_transparent_70%)] z-10 pointer-events-none"
                animate={{ opacity: [0, 0.5, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 2 }}
              />
            </motion.div>
            <motion.div
              {...ANIMATION_VARIANTS.badge}
              className="absolute -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 bg-gradient-to-r from-red-600 to-orange-600 text-white text-base sm:text-lg md:text-xl font-extrabold px-4 sm:px-6 py-2 sm:py-3 rounded-full uppercase z-20 flex items-center gap-2 sm:gap-3"
            >
              <span>Est. 1998</span>
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-lg sm:text-2xl md:text-3xl">
                💪
              </motion.span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cinematic Overlay Line */}
      <motion.div {...ANIMATION_VARIANTS.overlay} className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-transparent z-20" />
    </div>
  );
};

export default Home;