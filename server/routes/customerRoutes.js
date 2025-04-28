import express from 'express';
const router = express.Router();
import { getCustomerLists, updateAccessable, newCustomer, delCustomer } from '../controllers/customerController.js';
import { protect } from '../middleware/cookieAuthMiddleware.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

router.post('/customerlists', protect, getCustomerLists);

router.post('/updatecustomer', protect, authMiddleware.adminUser, updateAccessable);
router.post('/newcustomer', protect, authMiddleware.adminUser, newCustomer);
router.delete('/delcustomer', protect, authMiddleware.adminUser, delCustomer);

export default router;