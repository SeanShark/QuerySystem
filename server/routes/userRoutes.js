import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/cookieAuthMiddleware.js';
import * as authMiddleware from '../middleware/authMiddleware.js';
import getCaptcha from '../components/getCaptcha.js';
import { setUser, deleteUser, allUser } from '../controllers/adminController.js';

router.get("/captcha", getCaptcha);

/*
User regitster, login, forgot password
*/
router.post("/signup", userController.registerStepOne);
router.post("/verifysignup", userController.registerStepTwo);
router.post("/setpassword", userController.registerStepThree);

router.post('/logout', userController.logoutUser);
router.post("/login", userController.loginAuth);
// router.route('/verifyuser').post(protect, userController.verifyUser);
router.post('/verifyuser', protect, userController.verifyUser);

router.post("/forgot", userController.forgotStepOne);
router.post("/verifyforgotcode", userController.forgotStepTwo);
router.post("/resetpassword", userController.forgotStepThree);

/*
User personal setting
*/
router.post("/loggersetting", protect, userController.loggerSetting);
router.post("/personal", protect, userController.personalSetting);
router.post("/changepwd", protect, userController.changePassword);

/*
Administrator user 
*/
router.post("/alluser", protect, authMiddleware.adminUser, allUser);
router.post("/setuser", protect, authMiddleware.adminUser, setUser);
router.delete("/deleteuser", protect, authMiddleware.adminUser, deleteUser);

export default router;