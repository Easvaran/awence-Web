
import connectDB from "./lib/mongodb";
import User from "./models/User";

async function debugData() {
  try {
    await connectDB();
    const employees = await User.find({ role: "employee" });
    console.log("--- DEBUG EMPLOYEE DATA ---");
    employees.forEach(emp => {
      console.log(`Name: ${emp.name}`);
      console.log(`Email: ${emp.email}`);
      console.log(`Age: ${emp.age}`);
      console.log(`DOB: ${emp.dob}`);
      console.log(`Mobile: ${emp.mobile}`);
      console.log(`Status: ${emp.status}`);
      console.log('---------------------------');
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugData();
