import mongoose from "mongoose";

export const connectDB = () => {
  const url = process.env.MONGODB_URL;
  if (!url) {
    throw new Error("MONGODB_URL is not set");
  }
  return mongoose.connect(url);
};

export default connectDB;
