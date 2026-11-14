import  express  from "express";
import { cancleInvitationController, cancleJoinRequestController, createMembershipInvitationRequestController, createMembershipJoiningRequestController } from "../../controllers/Project/projectMembershipRequest.controller.js";


const router = express.Router();


//request creating routes 
router.post('/:projectId/request',createMembershipJoiningRequestController);
router.post('/:projectId/invite/:userId',createMembershipInvitationRequestController);


// canlce the request routes 
router.patch('/request/:requestId', cancleJoinRequestController)
router.patch('/invite/:requestId', cancleInvitationController)

export default router; 