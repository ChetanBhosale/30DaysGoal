import mongoose from "mongoose";
const dbConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://riottitan:amDVunnmcM1KJgtl@cluster0.vn5kyc0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("database connection successfully!");
  } catch (error: any) {
    setTimeout(() => {
      dbConnection();
    }, 1000);
    console.log("database connection failed!");
  }
};

export default dbConnection;
