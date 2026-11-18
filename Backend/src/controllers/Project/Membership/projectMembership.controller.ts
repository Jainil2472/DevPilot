import type { Request, Response, NextFunction } from "express";
import * as projectMembershipService from "../../../services/Project/Membership/projectMembership.service.js"; // Adjust path as needed
import { AppError } from "../../../utils/AppError.js";
import { projectMemberValidator, projectRequestParamsSchema, rejectValidator } from "../../../validators/Project/Membership/projectMembership.validators.js";

// 1. Approve Join Request Controller
export async function approveJoinRequestController(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId, requestId } = req.params;
        const ownerId = res.locals.userId;

        if (typeof ownerId !== "string") {
            throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
        }

        const validateData =  projectRequestParamsSchema.parse({params: { projectId, requestId }})
        const membership = await projectMembershipService.approveJoinRequest(validateData.params.projectId, validateData.params.requestId, ownerId);

        return res.status(200).json({
            success: true,
            message: "Join request approved successfully",
            data: membership,
        });
    } catch (error) {
        next(error); 
    }
}

// 2. Accept Invitation Controller
export async function acceptInvitationController(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId, requestId } = req.params;
        const userId = res.locals.userId; 
        
        if ( typeof userId !== "string") {
            throw new AppError(400, "Unauthorized", "UNAUTHORIZED");
        }
        const validateData =  projectRequestParamsSchema.parse({ params: { projectId, requestId }})

        const membership = await projectMembershipService.acceptInvitation(validateData.params.projectId, validateData.params.requestId, userId);

        return res.status(200).json({
            success: true,
            message: "Invitation accepted successfully",
            data: membership,
        });
    } catch (error) {
        next(error);
    }
}

// 3. Reject Join Request Controller
export async function rejectJoinRequestController(req: Request, res: Response, next: NextFunction) {
    try {
        const { requestId } = req.params;
        const ownerId = res.locals.userId;

        const validatedData = rejectValidator.parse({params: {requestId,ownerId}})
        const rejectedRequest = await projectMembershipService.rejectJoinRequest(validatedData.params.requestId,validatedData.params.userId);

        return res.status(200).json({
            success: true,
            message: "Join request rejected successfully",
            data: rejectedRequest,
        });
    } catch (error) {
        next(error);
    }
}

// 4. Reject Invitation Controller
export async function rejectInvitationController(req: Request, res: Response, next: NextFunction) {
    try {
        const { requestId } = req.params;
        const userId = res.locals.userId;

        const validatedData = rejectValidator.parse({params: {requestId,userId}})

        const rejectedInvitation = await projectMembershipService.rejectInvitation(validatedData.params.requestId,validatedData.params.userId);

        return res.status(200).json({
            success: true,
            message: "Invitation rejected successfully",
            data: rejectedInvitation,
        });
    } catch (error) {
        next(error);
    }
}


// 5. list project members 
export async function projectMemberController(req:Request, res: Response, next: NextFunction) {
    
    try {
        const { projectId } = req.params;
        const userId = res.locals.userId;

        const validatedData = projectMemberValidator.parse({params: {projectId,userId}})

        const members = await projectMembershipService.getProjectMembers(validatedData.params.projectId,validatedData.params.userId);
        return res.status(200).json({
            success: true,
            message: "Project members retrieved successfully",
            data: members,
        });
        
    } catch (error) {
        next(error)
    }
}