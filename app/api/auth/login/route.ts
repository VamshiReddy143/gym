import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(request:NextRequest){
    try {
        await dbConnect()
        const body=await request.json()

        const {email,password}=body
        if(!email || !password){
            return NextResponse.json({error:"Email and password are required"},{status:400})
        }
        const user = await User.findOne({email:email.toLowerCase()})
        if(!user){
            return NextResponse.json({error:"User not found"},{status:404})
        }
        if(!user.password){
            return NextResponse.json({error:"This email is registered via Google. Please use Google sign-in."},{status:400})
        }
        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return NextResponse.json({error:"Invalid password"},{status:401})
        }
        const token = jwt.sign({id:user._id.toString(),email:user.email,name:user.name,},process.env.JWT_SECRET!,{expiresIn:"1d"})
        return NextResponse.json({message:"Login successful",token},{status:200})
    } catch (error) {
        console.log(error)
      return NextResponse.json({error:"Something went wrong"},{status:500})
    }
}