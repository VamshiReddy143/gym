import { authOptions } from "@/app/auth/authOptions"
import NextAuth from "next-auth"


const handler = NextAuth(authOptions)

export const GET = handler
export const POST = handler