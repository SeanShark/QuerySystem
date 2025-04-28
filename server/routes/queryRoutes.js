import express from 'express';
const router = express.Router();
import * as queryControllers from '../controllers/queryController.js';
import { protect } from '../middleware/cookieAuthMiddleware.js';
import { addAuth, updateAuth, deleteAuth, allowDatabase, accessableCustomer } from '../middleware/authMiddleware.js';
//allowDatabase which allows the collection's type, such as: IP, Phone....


router.post('/', protect, allowDatabase, accessableCustomer, queryControllers.getQueryRusults);
// router.post('/emptyip', protect, allowDatabase, accessableCustomer, queryControllers.findEmptyIPs);

router.post('/newip', protect, allowDatabase, accessableCustomer, addAuth,queryControllers.newIp);
router.put('/updateip', protect, allowDatabase, accessableCustomer, updateAuth, queryControllers.updateIp);

router.post("/newphone", protect, allowDatabase, accessableCustomer, addAuth, queryControllers.newPhone);
router.put("/updatephone", protect, allowDatabase, accessableCustomer, updateAuth, queryControllers.updatePhone);

router.post("/newprinter", protect, allowDatabase, accessableCustomer, addAuth, queryControllers.newPrinter);
router.put("/updateprinter", protect, allowDatabase, accessableCustomer, updateAuth, queryControllers.updatePrinter);

router.post("/newdatacenter", protect, allowDatabase, accessableCustomer, addAuth, queryControllers.newDatacenter);
router.put("/updatedatacenter", protect, allowDatabase, accessableCustomer, updateAuth, queryControllers.updateDatacenter);

router.post("/newsurveillance", protect, allowDatabase, accessableCustomer, addAuth, queryControllers.newSurveillance);
router.put("/updatesurveillance", protect, allowDatabase, accessableCustomer, updateAuth, queryControllers.updateSurveillance);

//If the user do not have the permisions of the customer or type of database,
//He cannot query the results to delete. He can only delete what he permit to get.
router.delete("/delete", protect, deleteAuth, queryControllers.deleteRecord);

export default router;