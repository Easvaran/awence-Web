import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        console.log("Authorize called with:", credentials?.email);
        await connectDB();
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        const normalizedEmail = (credentials.email as string).toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
          console.log("User not found:", normalizedEmail);
          return null;
        }

        const isMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (!isMatch) {
          console.log("Password mismatch for:", normalizedEmail);
          return null;
        }

        // Check if employee is approved
        if (user.role === "employee") {
          if (user.status === "rejected") {
            console.log("User rejected by admin:", normalizedEmail);
            throw new Error("account_rejected");
          }
          if (!user.isApproved || user.status === "pending") {
            console.log("User not approved yet:", normalizedEmail);
            throw new Error("pending_approval");
          }
        }

        console.log("User authenticated:", user.email);
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          employeeId: user.employeeId,
        };
      },
    }),
  ],
});
