import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import UserModel from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers";
import crypto from "crypto";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const email = user.email;
          if (!email) return false;

          const cookieStore = await cookies();
          const callbackUrlCookie =
            cookieStore.get("next-auth.callback-url")?.value ||
            cookieStore.get("__Secure-next-auth.callback-url")?.value ||
            "";
          const decodedCallbackUrl = decodeURIComponent(callbackUrlCookie);
          const isSignUp = decodedCallbackUrl.includes("authAction=signup");

          let existingUser = await UserModel.findOne({ email, deletedAt: null });

          if (isSignUp) {
            // SIGN UP FLOW
            if (existingUser) {
              // User already exists, redirect back to register modal showing error
              return "/?error=UserAlreadyExists";
            }

            // Create user in DB if they don't exist (providing a dummy password since password is required by schema)
            existingUser = await UserModel.create({
              name: user.name || "Google User",
              email: email,
              password: crypto.randomBytes(16).toString("hex"),
              avatar: user.image ? { url: user.image, public_id: "" } : undefined,
              isEmailVerified: true,
              role: "user",
            });

            // Redirect back showing success to continue to login
            return "/?success=GoogleAccountCreated";
          } else {
            // LOGIN FLOW
            if (!existingUser) {
              // User not found during login: redirect to register modal showing error
              return "/?error=UserNotExist";
            }

            // Populate user object details for JWT mapping
            (user as any).id = existingUser._id.toString();
            (user as any).role = existingUser.role;
            return true;
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
};

