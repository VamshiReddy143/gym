"use client";

import * as React from "react";
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

export function BMIDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
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
              <Button className="z-[999] w-fit absolute top-4 right-4 font-bold px-10 bg-red-600 text-white" variant="secondary">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
