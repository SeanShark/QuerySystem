import express from 'express';
const router = express.Router();
import { uploadImageMongodb, uploadtest, getImageMongodb, uploadHardDisk, deleteImgHardDisk } from '../controllers/uploadController.js';
import { protect } from '../middleware/cookieAuthMiddleware.js';

router.route('/imgs').post(protect, uploadImageMongodb).get(protect, getImageMongodb);
router.put('/deleteimg', protect, deleteImgHardDisk);

router.post('/imgsarray', protect, uploadHardDisk);

export default router;