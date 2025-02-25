import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
        await dbConnect()
        const {email,name,password} = await req.json()

        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json({error:"User already exists"})
        }
        

        const hashedPassword = password? await bcrypt.hash(password,10):null

        const newUser = await User.create({
            email,
            password:hashedPassword,
            name,
            image:"",
            isAdmin:false,
            phonenumber:"",
            Address:"",
            subscription:""
        })
        return NextResponse.json({message:"User created successfully",user:newUser._id},{status:201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Something went wrong"},{status:500})
    }
}