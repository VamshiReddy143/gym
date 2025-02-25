"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail,  Lock } from "lucide-react";
import gymlogo from "@/public/gymlogo.jpg"
import googleicon from "@/public/google-icon.png"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { signIn } from "next-auth/react";


const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;
const SignIn = () => {

  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      // Call the login API route
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Invalid credentials");
      }

     
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, 
      });

      
      toast.success("Login successful!");
      router.push("/");
    } catch {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast.loading("Redirecting to Google...");
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div style={{
      backgroundImage: "url('/background.jpg')", width: "100%",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-8 py-6 bg-gray-800 rounded-2xl transition-transform transform hover:scale-105 border border-gray-700 shadow-lg w-96  bg-black/70 backdrop-blur-sm  border-white/20"
      >
        <div className="flex items-center gap-2">
          <Image src={gymlogo} alt="Gym Logo" width={600} height={600} className="object-contain  h-10 w-10" />
          <h1 className="sm:text-3xl font-serif font-bold">
            FITN<strong className="text-orange-500">ASE</strong>
          </h1>
        </div>

        {/* Email Field */}
        <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg">
          <Mail className="w-5 h-5 text-gray-400" />
          <input
           {...register("email")}
            type="email"
            autoComplete="off"
            placeholder="Email"
          
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            required
          />
        </div>
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      

        {/* Password Field */}
        <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg">
          <Lock className="w-5 h-5 text-gray-400" />
          <input
           {...register("password")}
            type="password"
            autoComplete="off"
            placeholder="Password"    
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            required
          />
        </div>
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

       
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

       
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
        >
          <Image src={googleicon} width={20} height={20} alt="Google" />
          Sign In with Google
        </button>

       
        <div className="flex justify-between mt-4">
          <Link href="/sign-up">
            <button  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-600 transition">
              Register
            </button>
          </Link>
          <Link href="/forgot-password">
            <button className="px-6 py-2 bg-[#f65403] text-white rounded-lg hover:bg-red-500 transition">
              Forgot Password?
            </button>
          </Link>
        </div>
      </form>
      <Toaster/>
    </div>
  );
};

export default SignIn;
