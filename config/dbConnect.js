import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URL);
    //strogiy rezim mongoose.set('strictQuery':false )
    console.log(`MongoDB connected ${connected.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};
export default dbConnect;
