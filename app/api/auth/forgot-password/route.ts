import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Failed to parse request JSON body");
      return NextResponse.json({ error: "Invalid request format." }, { status: 400 });
    }

    const { email, newPassword, action, otp } = body;
    console.log(`Action: ${action}, Email: ${email}`);
    await connectDB();

    const normalizedEmail = email?.toLowerCase().trim();
    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Find user by email (any role)
    const user = await User.findOne({ email: normalizedEmail });
    console.log(`User found: ${!!user}`);

    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    if (action === "verify_email") {
      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await User.findByIdAndUpdate(user._id, {
        resetOtp: generatedOtp,
        resetOtpExpires: expires,
      });

      // Send live email via SMTP
      try {
        await sendEmail({
          to: normalizedEmail,
          subject: "Awence Password Reset OTP",
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #2563eb;">Password Reset Request</h2>
              <p>Hello ${user.name || 'User'},</p>
              <p>You have requested to reset your password. Please use the 6-digit code below to verify your identity. This code will expire in 10 minutes.</p>
              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #1e293b;">
                ${generatedOtp}
              </div>
              <p style="margin-top: 20px; font-size: 14px; color: #64748b;">
                If you did not request this, please ignore this email or contact support.
              </p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} Awence BPO. All rights reserved.</p>
            </div>
          `,
        });
        return NextResponse.json({ message: "OTP sent to your email." });
      } catch (emailError: any) {
        console.error("--- NODEMAILER ERROR ---");
        console.error(emailError);
        console.error("------------------------");
        return NextResponse.json({ 
          error: "Failed to send OTP email. Please check SMTP settings.",
          details: emailError.message 
        }, { status: 500 });
      }
    }

    if (action === "verify_otp") {
      console.log("Verifying OTP for", normalizedEmail);
      if (!otp) {
        return NextResponse.json({ error: "OTP is required." }, { status: 400 });
      }

      console.log(`User resetOtp: ${user.resetOtp}, resetOtpExpires: ${user.resetOtpExpires}`);
      if (!user.resetOtp || !user.resetOtpExpires) {
        return NextResponse.json({ error: "No active reset request found for this account." }, { status: 400 });
      }

      const cleanOtp = otp.toString().trim();
      const storedOtp = user.resetOtp.toString().trim();
      const now = new Date();
      const expires = new Date(user.resetOtpExpires);

      console.log("--- OTP VERIFICATION DEBUG ---");
      console.log("Received OTP:", `"${cleanOtp}"`);
      console.log("Stored OTP:", `"${storedOtp}"`);
      console.log("Now:", now.toISOString());
      console.log("Expires:", expires.toISOString());
      console.log("Is Expired:", now > expires);
      console.log("Match:", storedOtp === cleanOtp);
      console.log("------------------------------");

      if (storedOtp !== cleanOtp || now > expires) {
        return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
      }

      return NextResponse.json({ message: "OTP verified." });
    }

    if (action === "reset") {
      if (!newPassword || !otp) {
        return NextResponse.json({ error: "Password and OTP are required." }, { status: 400 });
      }

      const cleanOtp = otp.toString().trim();
      const storedOtp = user.resetOtp?.toString().trim();
      const now = new Date();
      const expires = new Date(user.resetOtpExpires);

      // Re-verify OTP for security before final reset
      if (storedOtp !== cleanOtp || now > expires) {
        return NextResponse.json({ error: "Invalid or expired session." }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(user._id, { 
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpires: null
      });

      return NextResponse.json({ message: "Password updated successfully." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("CRITICAL ERROR in Forgot Password Route:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Full Error:", error);
    return NextResponse.json({ 
      error: "Failed to process request.",
      details: error.message || "Unknown error",
      type: error.name || "Error"
    }, { status: 500 });
  }
}
