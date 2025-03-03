"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import gymlogo from "@/public/gymlogo.jpg";
import googleicon from "@/public/google-icon.png";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const SignUp = () => {
    const router = useRouter();

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

                if (!loginResponse || loginResponse.error) {
                    toast.error("Login failed: " + loginResponse?.error);
                    return;
                }

                router.push("/");
            } else {
                toast.error(response.data.error || "Registration failed.");
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error("Error registering:", error);
                toast.error(error.response?.data?.error || "Something went wrong. Please try again.");
              }
              else {
                console.error("Unknown error:", error);
                toast.error("Something went wrong. Please try again.");
              }
            }
        };
            
    const handleGoogleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.loading("Redirecting to Google...");
        signIn("google", { callbackUrl: "/" });
    };



    return (
        <div
            style={{
                backgroundImage: "url('/background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            className="flex justify-center items-center min-h-screen bg-black/80 overflow-hidden relative"
        >
            {/* Subtle Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1),_transparent_70%)] pointer-events-none opacity-50" />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-10 pointer-events-none" />

            {/* Animated Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 pointer-events-none"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-6 px-10 py-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border-2 border-red-900/50 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-all duration-500 w-full max-w-md relative z-10"
            >
                {/* Logo & Title */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="flex items-center gap-3 mb-4"
                >
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 200 }}>
                        <Image
                            src={gymlogo}
                            alt="Gym Logo"
                            width={50}
                            height={50}
                            className="object-contain rounded-full shadow-[0_0_10px_rgba(255,165,0,0.5)]"
                        />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold uppercase tracking-wider">
                        FITN
                        <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            ASE
                        </span>
                    </h1>
                </motion.div>

                {/* Username Field */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-orange-500 transition-all duration-300"
                >
                    <User className="w-6 h-6 text-gray-400" />
                    <input
                        {...register("name")}
                        type="text"
                        autoComplete="off"
                        placeholder="Username"
                        className="w-full bg-transparent outline-none text-white placeholder-gray-500 font-medium"
                        required
                    />
                </motion.div>
                {errors.name && (
                    <p className="text-red-500 text-sm font-medium">{errors.name.message}</p>
                )}

                {/* Email Field */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-orange-500 transition-all duration-300"
                >
                    <Mail className="w-6 h-6 text-gray-400" />
                    <input
                        {...register("email")}
                        type="email"
                        autoComplete="off"
                        placeholder="Email"
                        className="w-full bg-transparent outline-none text-white placeholder-gray-500 font-medium"
                        required
                    />
                </motion.div>
                {errors.email && (
                    <p className="text-red-500 text-sm font-medium">{errors.email.message}</p>
                )}

                {/* Password Field */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                    className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-orange-500 transition-all duration-300"
                >
                    <Lock className="w-6 h-6 text-gray-400" />
                    <input
                        {...register("password")}
                        type="password"
                        autoComplete="off"
                        placeholder="Password"
                        className="w-full bg-transparent outline-none text-white placeholder-gray-500 font-medium"
                        required
                    />
                </motion.div>
                {errors.password && (
                    <p className="text-red-500 text-sm font-medium">{errors.password.message}</p>
                )}

                {/* Register Button */}
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,165,0,0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-extrabold uppercase rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.4)]"
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </motion.button>

                {/* Google Sign Up */}
                <motion.button
                    type="button"
                    onClick={handleGoogleSignIn}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 px-8 py-3 bg-white text-black text-lg font-extrabold uppercase rounded-full hover:bg-gray-200 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                >
                    <Image src={googleicon} width={24} height={24} alt="Google" />
                    Sign Up with Google
                </motion.button>

                {/* Login Link */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                    className="flex justify-center mt-6"
                >
                    <Link href="/sign-in">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255,165,0,0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-gray-800 text-white text-base font-bold uppercase rounded-full hover:bg-gray-700 transition-all duration-300 shadow-[0_0_5px_rgba(255,0,0,0.2)]"
                        >
                            Already have an account? Login
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.form>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};
    
export default SignUp;