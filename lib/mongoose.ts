import mongoose, { ConnectOptions } from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  console.log(process.env.MONGODB_URI);
  if (!process.env.MONGODB_URI) return console.log("Missing MONGODB_URI");

  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    } catch (error) {
      console.log(error);
    }
  }
};
