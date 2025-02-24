"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail,  Lock } from "lucide-react";
import gymlogo from "@/public/gymlogo.jpg"
import googleicon from "@/public/google-icon.png"
const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign-Up Data:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 px-8 py-6 bg-gray-800 rounded-2xl transition-transform transform hover:scale-105 border border-gray-700 shadow-lg w-96"
      >
        <div className="flex items-center gap-2">
          <Image src={gymlogo} alt="Gym Logo" width={600} height={600} className="object-contain  h-10 w-10" />
          <h1 className="sm:text-3xl font-serif font-bold">
            FITN<strong className="text-orange-500">ASE</strong>
          </h1>
        </div>

        {/* Email Field */}
        <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
          <Mail className="w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            required
          />
        </div>

      

        {/* Password Field */}
        <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
          <Lock className="w-5 h-5 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            required
          />
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Sign In
        </button>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
        >
          <Image src={googleicon} width={20} height={20} alt="Google" />
          Sign In with Google
        </button>

        {/* Login and Forgot Password Links */}
        <div className="flex justify-between mt-4">
          <Link href="/sign-up">
            <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
              Register
            </button>
          </Link>
          <Link href="/forgot-password">
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition">
              Forgot Password?
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
