import { Router } from "express";
import {
    approveJoinRequestController,
    acceptInvitationController,
    rejectJoinRequestController,
    rejectInvitationController
} from "../../controllers/Project/projectMembership.controller.js"; 

const router = Router();

// 1. Approve Join Request Route
router.patch(
    "/:projectId/request/:requestId/approve",
    approveJoinRequestController
);

// 2. Accept Invitation Route
router.patch(
    "/:projectId/invitations/:requestId/accept",
    acceptInvitationController
);

// 3. Reject Join Request Route
router.patch(
    "/request/:requestId/reject",
    rejectJoinRequestController
);

// 4. Reject Invitation Route
router.patch(
    "/invitations/:requestId/reject",
    rejectInvitationController
);

export default router;