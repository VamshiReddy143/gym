"use client";


import Link from "next/link";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, User, Lock } from "lucide-react";
import gymlogo from "@/public/gymlogo.jpg"
import googleicon from "@/public/google-icon.png"
import { signIn } from "next-auth/react";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const registerSchema = z.object({
    name:z.string().min(3,"Name must be atleast 3 characters long"),
    email:z.string().email("Invalid email format"),
    password:z.string().min(6,"Password must be atleast 6 characters")
})

type RegisterFormData=z.infer<typeof registerSchema>


const SignUp = () => {
  
  const router =useRouter()
  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const response = await axios.post("/api/auth/register", data);
  
      if (response.status === 201) {  
        toast.success("Registration successful! Redirecting...");
        
       
        const loginResponse = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.push("/");
  
        if (!loginResponse || loginResponse.error) {
          toast.error("Login failed: " + loginResponse?.error);
          return;
        }
  
       
      } else {
        toast.error(response.data.error || "Registration failed.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong. Please try again.");
    }
  };
  

  
  const handleGoogleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn("google", { callbackUrl: "/" });
  };
 

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-8 py-6 bg-gray-800 rounded-2xl transition-transform transform hover:scale-105 border border-gray-700 shadow-lg w-96"
      >
        <div className="flex items-center gap-2">
          <Image src={gymlogo} alt="Gym Logo" width={600} height={600} className="object-contain  h-10 w-10" />
          <h1 className="sm:text-3xl font-serif font-bold">
            FITN<strong className="text-orange-500">ASE</strong>
          </h1>
        </div>


          {/* Username Field */}
        <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
          <User className="w-5 h-5 text-gray-400" />
          <input
          {...register("name")}
            type="text"
            placeholder="Username"
             autoComplete="off"
            className="w-full bg-transparent outline-none text-white placeholder-gray-400 focus:bg-transparent"           
          />
        </div>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        {/* Email Field */}
        <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
          <Mail className="w-5 h-5 text-gray-400" />
          <input
          {...register("email")}
            type="email"
            placeholder="Email"
             autoComplete="off"
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            required
          />
        </div>
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      

        {/* Password Field */}
        <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
          <Lock className="w-5 h-5 text-gray-400" />
          <input
          {...register("password")}
            type="password"
            placeholder="Password"  
            autoComplete="off"   
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            required
          />
        </div>
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
        >
          <Image src={googleicon} width={20} height={20} alt="Google" />
          Sign Up with Google
        </button>

        {/* Login and Forgot Password Links */}
        <div className="flex  gap-10 items-center mt-4">

            <div>
                <h1>Already have an account?</h1>
            </div>
          <Link href="/sign-in">
            <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
              Login
            </button>
          </Link>
          
        </div>
      </form>
      <Toaster  position="top-center" reverseOrder={false} />
    </div>
  );
};

export default SignUp;
