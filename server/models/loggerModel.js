import mongoose from "mongoose";

const LoggerSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  logger: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  }
});

const Logger = mongoose.models.logger || mongoose.model("Logger", LoggerSchema);

export default Logger;
