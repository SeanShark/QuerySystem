import express from 'express';
const router = express.Router();
import { protect } from '../middleware/cookieAuthMiddleware.js';
import { allLogger, newlogger, updateLogger, deleteLogger } from '../controllers/loggerController.js';

router.post("/logger", protect, allLogger);
router.post("/newlogger", protect, newlogger);
router.post("/updateLogger", protect, updateLogger);
router.delete("/deletelogger", protect, deleteLogger);

export default router;