import mongoose from "mongoose";
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("database connection successfully!");
  } catch (error: any) {
    setTimeout(() => {
      dbConnection();
    }, 1000);
    console.log("database connection failed!");
  }
};

export default dbConnection;
