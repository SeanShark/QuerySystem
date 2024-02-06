import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  todo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
    // timezone: 'Asia/Shanghai' // set timezone to EST
  },
  color: {
    type: String,
    default: "black",
  },
  isDone: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.models.todo || mongoose.model("Todo", todoSchema);

export default Todo;