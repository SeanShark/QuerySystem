import mongoose from "mongoose";
import os from 'os';
import dotenv from 'dotenv';
dotenv.config();

let dbURL = null;

if(os.cpus()[0].model === '12th Gen Intel(R) Core(TM) i7-12700F') {
  dbURL = process.env.mongoDBRemote;
} else {
  dbURL = process.env.mongoDBLocal;
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbURL);
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;