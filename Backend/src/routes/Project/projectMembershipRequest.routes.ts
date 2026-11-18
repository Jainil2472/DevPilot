import  express  from "express";
import { cancleInvitationController, cancleJoinRequestController, createMembershipInvitationRequestController, createMembershipJoiningRequestController, getIncomingInvitationsController, getSentJoinRequestsController } from "../../controllers/Project/Membership/projectMembershipRequest.controller.js";


const router = express.Router();


//request creating routes 
router.post('/:projectId/request',createMembershipJoiningRequestController);
router.post('/:projectId/invite/:userId',createMembershipInvitationRequestController);


// canlce the request routes 
router.patch('/request/:requestId', cancleJoinRequestController)
router.patch('/invite/:requestId', cancleInvitationController)


// User Dashboard Endpoints
router.get("/requests/sent", getSentJoinRequestsController);
router.get("/invitations/incoming", getIncomingInvitationsController);


export default router; 