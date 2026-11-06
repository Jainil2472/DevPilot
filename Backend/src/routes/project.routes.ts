import  express  from "express";
import { projectCreateController, projectDeleteContoller, updateProjectController, userProjectListContoller } from "../controllers/project.controller.js";


const router = express.Router();

router.post('/',projectCreateController);
router.patch('/:projectId',updateProjectController);
router.get('/',userProjectListContoller);
router.delete('/:projectId',projectDeleteContoller);

export default router; 