"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function DropdownMenuDemo() {
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-white bg-transparent border-none">More</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
         <Link href={"/Timetable"}>
            <DropdownMenuRadioItem value="top" className=" bg-transparent cursor-pointer">Timetable</DropdownMenuRadioItem>
         </Link>
          <Link href={"/admin/dashboard"}>
          <DropdownMenuRadioItem value="bottom">AdminDashboard</DropdownMenuRadioItem>
          </Link>
          <Link href={"/plans"}>
          <DropdownMenuRadioItem value="right">Workouts</DropdownMenuRadioItem>
          </Link>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
