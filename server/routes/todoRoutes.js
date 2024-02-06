import express from 'express';
const router = express.Router();
import { getTodolists, newTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';
import { protect } from '../middleware/cookieAuthMiddleware.js';

router.post("/gettodolists", protect, getTodolists);
router.post("/newtodo", protect, newTodo);
router.delete("/:id", protect, deleteTodo);
router.put("/", protect, updateTodo);

export default router;
