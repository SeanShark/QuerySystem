import express from 'express';
const router = express.Router();
import * as queryControllers from '../controllers/queryController.js';
import { protect } from '../middleware/cookieAuthMiddleware.js';
import { customerControl, addAuth, updateAuth, deleteAuth, allowDatabase} from '../middleware/authMiddleware.js';

router.post('/', protect, allowDatabase, customerControl, queryControllers.getQueryRusults);

router.post('/newip', protect, allowDatabase, customerControl, addAuth,queryControllers.newIp);
router.put('/updateip', protect, allowDatabase, customerControl, updateAuth, queryControllers.updateIp);

router.post("/newphone", protect, allowDatabase, customerControl, addAuth, queryControllers.newPhone);
router.put("/updatephone", protect, allowDatabase, customerControl, updateAuth, queryControllers.updatePhone);

router.post("/newprinter", protect, allowDatabase, customerControl, addAuth, queryControllers.newPrinter);
router.put("/updateprinter", protect, allowDatabase, customerControl, updateAuth, queryControllers.updatePrinter);

router.post("/newdatacenter", protect, allowDatabase, customerControl, addAuth, queryControllers.newDatacenter);
router.put("/updatedatacenter", protect, allowDatabase, customerControl, updateAuth, queryControllers.updateDatacenter);

router.post("/newsurveillance", protect, allowDatabase, customerControl, addAuth, queryControllers.newSurveillance);
router.put("/updatesurveillance", protect, allowDatabase, customerControl, updateAuth, queryControllers.updateSurveillance);

//If the user do not have the permisions of the customer or type of database,
//He cannot query the results to delete. He can only delete what he permit to get.
router.delete("/delete", protect, deleteAuth, queryControllers.deleteRecord);

export default router;