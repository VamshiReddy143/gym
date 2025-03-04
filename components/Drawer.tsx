"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import BMICalculatorPage from "./BMIPage";

// Define animation variants for the button
const buttonVariants = {
  idle: {
    scale: 1,
    rotate: 0,
    boxShadow: "0px 0px 10px rgba(255, 0, 0, 0.3)",
    background: "linear-gradient(135deg, #dc2626, #991b1b)", // red-600 to red-800
    transition: { duration: 0.8, ease: "easeInOut" },
  },
  hover: {
    scale: 1.2,
    rotate: 15, // Slight tilt for flair
    boxShadow: "0px 0px 20px rgba(255, 0, 0, 0.6), 0px 0px 30px rgba(255, 75, 0, 0.4)",
    background: "linear-gradient(135deg, #ef4444, #b91c1c)", // Lighter red on hover
    transition: { duration: 0.4, ease: "easeOut" },
  },
  tap: {
    scale: 0.9,
    rotate: -10, // Reverse tilt on click
    boxShadow: "0px 0px 5px rgba(255, 0, 0, 0.2)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Optional emoji animation (pulsing effect)
const emojiVariants = {
  idle: { scale: 1, rotate: 0 },
  hover: { scale: 1.3, rotate: [0, 10, -10, 0], transition: { duration: 0.5, repeat: Infinity } },
  tap: { scale: 0.8, transition: { duration: 0.2 } },
};

export function BMIDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <motion.div
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          className="fixed top-20 right-0 z-50"
        >
          <Button
            variant="outline"
            className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-red-700/50 group overflow-hidden relative"
          >
            {/* Gradient overlay for extra depth */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1.5, transition: { duration: 0.5 } }}
              whileHover={{ scale: 2, transition: { duration: 0.3 } }}
            />
            {/* Animated emoji */}
            <motion.span variants={emojiVariants} className="relative z-10 text-2xl ">
              💪
            </motion.span>
          </Button>
        </motion.div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh] overflow-y-auto">
        <div className="mx-auto w-full px-4">
          <DrawerHeader className="hidden">
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <BMICalculatorPage />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                className="z-[999] w-fit absolute top-4 right-4 font-bold px-10 bg-red-600 text-white"
                variant="secondary"
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default BMIDrawer;