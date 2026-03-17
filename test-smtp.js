
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function testSMTP() {
  console.log("--- SMTP CONNECTION TEST ---");
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // Timeout setting
    connectionTimeout: 5000,
  });

  try {
    console.log("Verifying connection...");
    await transporter.verify();
    console.log("SUCCESS: Connection verified successfully!");
    process.exit(0);
  } catch (err) {
    console.error("FAILURE: Connection failed!");
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
    process.exit(1);
  }
}

testSMTP();
