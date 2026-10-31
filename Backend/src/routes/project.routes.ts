import  express  from "express";
import { projectController } from "../controllers/project.controller.js";


const router = express.Router();

router.post('/create',projectController)


export default router; 