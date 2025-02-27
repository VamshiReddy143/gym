"use client";

import Image from "next/image";
import gymlogo from "@/public/gymlogo.jpg";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const schedule = [
  { time: "6:00am - 8:00am", monday: "HIIT", tuesday: "Cardio", wednesday: "Yoga", thursday: "Strength Training", friday: "CrossFit", saturday: "Pilates", sunday: "Rest" },
  { time: "10:00am - 12:00pm", monday: "Functional Training", tuesday: "Weight Training", wednesday: "Boxing", thursday: "Spin Class", friday: "Body Building", saturday: "Zumba", sunday: "Rest" },
  { time: "5:00pm - 7:00pm", monday: "Kickboxing", tuesday: "Yoga", wednesday: "Strength Training", thursday: "HIIT", friday: "Mobility & Recovery", saturday: "Athletic Conditioning", sunday: "Rest" },
  { time: "7:00pm - 9:00pm", monday: "Cardio", tuesday: "Weight Lifting", wednesday: "CrossFit", thursday: "Pilates", friday: "Zumba", saturday: "Open Gym", sunday: "Rest" },
];

const Timetable = () => {
  return (
    <div className="max-w-7xl mx-auto mb-[10em] p-8 bg-gradient-to-br from-gray-900 to-black shadow-[0_0_30px_rgba(255,0,0,0.3)] mt-12 rounded-3xl overflow-hidden relative">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.15),_transparent_70%)] opacity-40 pointer-events-none" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent pointer-events-none"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center justify-center gap-3 mb-12"
      >
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 200 }}>
          <Image
            src={gymlogo}
            alt="Gym Logo"
            width={60}
            height={60}
            className="object-contain rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)]"
          />
        </motion.div>
        <h1 className="text-4xl font-extrabold uppercase tracking-wider text-white">
          FITN
          <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            ASE
          </span>
        </h1>
      </motion.div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-white text-lg relative z-10">
          <thead>
            <motion.tr
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-gradient-to-r from-red-700 to-red-900 text-white"
            >
              <th className="p-4 sticky left-0 bg-red-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Time
                </div>
              </th>
              <th className="p-4">Monday</th>
              <th className="p-4">Tuesday</th>
              <th className="p-4">Wednesday</th>
              <th className="p-4">Thursday</th>
              <th className="p-4">Friday</th>
              <th className="p-4">Saturday</th>
              <th className="p-4">Sunday</th>
            </motion.tr>
          </thead>
          <tbody>
            {schedule.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className="border-t border-red-900/30 hover:bg-gray-800/50 transition-all duration-300"
              >
                <td className="p-4 text-red-500 font-semibold sticky left-0 bg-gray-900/80 backdrop-blur-sm">
                  {row.time}
                </td>
                
                {Object.keys(row).slice(1).map((day, i) => (
                  <td key={i} className="p-4 text-center">
                    <motion.div
                      whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255,0,0,0.4)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`py-2 px-4 rounded-xl transition-all duration-300 ${
                        row[day] === "Rest"
                          ? "bg-gray-700/50 text-gray-500"
                          : "bg-gradient-to-r from-red-600/20 to-red-800/20 text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 hover:text-black"
                      }`}
                    >
                      {row[day] || "-"}
                    </motion.div>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
           
    </div>
  );
};

export default Timetable;