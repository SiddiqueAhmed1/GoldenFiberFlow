import mongoose from "mongoose";

export const mongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`mongodb connection succesfull`.bgMagenta.black);
  } catch (error) {
    console.log(`${error}`.bgRed.black);
  }
};
