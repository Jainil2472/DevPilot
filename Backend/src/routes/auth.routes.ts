import  express  from "express";
import { signupController , loginController, emailVerificationController} from "../controllers/auth.controller.js";


const router = express.Router();

router.post('/signup',signupController)
router.get('/verification',emailVerificationController)
router.post('/login',loginController)

export default router; 