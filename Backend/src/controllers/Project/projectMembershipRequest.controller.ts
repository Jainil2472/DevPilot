import type { RequestHandler } from "express";
import { cancleValidator, projectInvitationValidator, projectJoinRequestValidator } from "../../validators/Project/projectMembershipRequest.validators.js";
import { cancleInvitation, cancleJoinRequest, createInvitation, createJoinRequest } from "../../services/Project/projectMembershipRequest.service.js";


//request creation controller 
//join request controller
export const createMembershipJoiningRequestController: RequestHandler = async (req ,res ,next ) => {

    try {
        const projectId = req.params.projectId;
        const role = req.body.role;
        const message = req.body.message;
        const userId = res.locals.userId;
        const validatedData = projectJoinRequestValidator.parse({projectId,role,message})

        const createRequest = await createJoinRequest(validatedData.projectId,userId,validatedData.role,validatedData.message);
        return res.status(201).json({
            success: true,
            message: "Request created successfully",
            data: createRequest
        });
        
    } catch (error) {
        next(error)
    }
}

// invitation controller
export const createMembershipInvitationRequestController: RequestHandler = async (req, res, next) => {

     try {
        const {projectId, userId} = req.params;
        const role = req.body.role;
        const message = req.body.message;
        const ownerId = res.locals.userId;
        const validatedData = projectInvitationValidator.parse({projectId,userId,role,message})

        const createRequest = await createInvitation(validatedData.projectId,ownerId,validatedData.userId,validatedData.role,validatedData.message);
        return res.status(201).json({
            success: true,
            message: "Request created successfully",
            data: createRequest
        });
        
    } catch (error) {
        next(error)
    }
}



//request cancellation controller
// cancle join request controller
export const cancleJoinRequestController: RequestHandler = async (req , res ,next) => {

     try {
        const  requestId = req.params.requestId;
        const userId = res.locals.userId;

        const validatedData= cancleValidator.parse({requestId})
        const createRequest = await cancleJoinRequest(validatedData.requestId,userId);
        return res.status(201).json({
            success: true,
            message: "Join request cancelled successfully",
            data: createRequest
        });
        
    } catch (error) {
        next(error)
    }
}
// cancle Invitation controller
export const cancleInvitationController: RequestHandler = async (req , res ,next) => {

     try {
        const  requestId = req.params.requestId;
        const userId = res.locals.userId;

        const validatedData= cancleValidator.parse({requestId})
        const createRequest = await cancleInvitation(validatedData.requestId,userId);
        return res.status(201).json({
            success: true,
            message: "Invitation cancelled successfully",
            data: createRequest
        });
        
    } catch (error) {
        next(error)
    }
}


