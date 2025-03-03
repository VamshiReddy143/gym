import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { Session, User as NextAuthUser } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import dbConnect from "@/lib/mongodb";
import type { Account } from "next-auth";
import User, { IUser } from "@/models/User";

// Extend NextAuth types
interface ExtendedUser extends NextAuthUser {
  isAdmin?: boolean;
}

// Augment NextAuth types
// declare module "next-auth/jwt" {
//   interface JWT {
//     id?: string;
//     isAdmin?: boolean; // Keep as optional boolean
//   }
// }

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       email?: string;
//       name?: string;
//       image?: string;
//       isAdmin: boolean;
//     }
//   }
// }

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error("This email is registered via Google. Please use Google sign-in.");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return { 
          id: user._id.toString(), 
          email: user.email, 
          name: user.name, 
          isAdmin: user.isAdmin ?? false // Ensure boolean with default
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { 
      token: JWT; 
      user?: ExtendedUser | IUser; 
      account?: Account | null 
    }) {
      await dbConnect();

      if (account?.provider === "google") {
        let existingUser = await User.findOne({ email: user?.email });

        if (!existingUser) {
          existingUser = await User.create({
            googleId: user?.id,
            email: user?.email,
            name: user?.name,
            image: user?.image || "",
            password: null,
            isAdmin: false,
          });
        }

        token.id = existingUser._id.toString();
        token.isAdmin = existingUser.isAdmin ?? false; // Ensure boolean with default
      } else if (user && 'id' in user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = user.isAdmin ?? false; // Ensure boolean with default
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.isAdmin = token.isAdmin ?? false; // Ensure boolean with default
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};