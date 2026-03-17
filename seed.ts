const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const connectDB = require("./lib/mongodb").default;
const User = require("./models/User").default;
const bcrypt = require("bcryptjs");

async function seedData() {
  try {
    await connectDB();
    
    // Seed/Update Admin
    const adminEmail = "admin@awence.com";
    const adminPassword = "admin123";
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!admin) {
      await User.create({
        name: "Admin User",
        email: adminEmail.toLowerCase(),
        password: hashedAdminPassword,
        role: "admin",
        isApproved: true,
        status: "approved"
      });
      console.log("Admin user created: admin@awence.com / admin123");
    } else {
      admin.password = hashedAdminPassword;
      admin.role = "admin";
      admin.isApproved = true;
      admin.status = "approved";
      await admin.save();
      console.log("Admin user password reset to: admin123");
    }

    // Seed Employees if none exist
    const employeeCount = await User.countDocuments({ role: "employee" });
    if (employeeCount === 0) {
      const employees = [
        { 
          name: "John Doe", 
          email: "john@awence.com", 
          password: await bcrypt.hash("password123", 10), 
          role: "employee",
          isApproved: true,
          status: "approved"
        },
        { 
          name: "Jane Smith", 
          email: "jane@awence.com", 
          password: await bcrypt.hash("password123", 10), 
          role: "employee",
          isApproved: true,
          status: "approved"
        },
      ];
      await User.insertMany(employees);
      console.log("Seeded 2 approved test employees");
    }
    
    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    process.exit();
  }
}

seedData();
