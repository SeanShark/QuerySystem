import express from 'express';
const router = express.Router();
import { uploadImage, getImage, deleteImg } from '../controllers/uploadController.js';

router.route('/imgs').post(uploadImage).get(getImage);

router.put('/deleteimg', deleteImg);

export default router;