import type z from "zod";
import {  type createOwner } from "../../validators/Project/projectMembership.validators.js";
import { ProjectMembership } from "../../models/projectMembership.model.js";
import { Project } from "../../models/project.model.js";
import { AppError } from "../../utils/AppError.js";
import { User } from "../../models/user.model.js";
import mongoose, { type ClientSession } from "mongoose";
import { ProjectJoinRequest } from "../../models/projectJoinRequest.model.js";


//approve the request 

interface AddMemberInput {
    projectId: string | mongoose.Types.ObjectId;
    userId: string | mongoose.Types.ObjectId;
    role: "ADMIN" | "MEMBER";
}

//owner creation
export async function createOwnerMembership(input: z.infer<typeof createOwner>, session: mongoose.ClientSession) {
    
    const { projectId, userId, role } = input;
    
    const isProjectExsist = await Project.findOne({
        _id: projectId,
        ownerId: userId,
        deletedAt: null,
    }).session(session);
    
    if(!isProjectExsist){
        throw new AppError(
            404, 
            "Project not found or you do not have permission to access it.",
            "PROJECT_NOT_FOUND"
        );
    }
    
    const createMembership = await ProjectMembership.create([{
        projectId,
        userId,
        role,
        joinedAt: new Date(),
    }], { session });
    
    return createMembership;
} 

export async function approveJoinRequest(projectId: string, requestId: string, ownerId: string) {
    
    const session = await mongoose.startSession();
    
    try {
        let membership;
        await session.withTransaction(async () => {
            
            const project = await Project.findOne({
                _id: projectId,
                ownerId,
                deletedAt: null,
            }).session(session);
            
            if (!project) {
                throw new AppError(
                    404,
                    "Project not found or you are not the owner.",
                    "PROJECT_NOT_FOUND"
                );
            }
            
            const findRequest = await ProjectJoinRequest.findOne({
                _id: requestId,
                projectId,
                type: "JOIN_REQUEST",
                status: "PENDING"
            }).session(session);
            
            if(!findRequest){
                throw new AppError(
                    404, 
                    "The Request is not found",
                    "REQUEST_NOT_FOUND"
                );
            }
            
            const role = findRequest.role;
            const userId = findRequest.userId;
            
            const formerMembership = await ProjectMembership.findOne({
                projectId,
                userId,
                status: {
                    $in: ["LEFT", "REMOVED"]
                }
            }).session(session);
            
            if(formerMembership){
                membership = await reActivateMembership(findRequest.role, formerMembership._id, session);
            } else {
                membership = await addProjectMember({ projectId, userId, role }, session);
            }
            
            await ProjectJoinRequest.findByIdAndUpdate(findRequest._id, {
                $set: { status: "ACCEPTED" },
            }, { session });
        });
        
        return membership;
    } catch(err) {
        throw err;
    } finally {
        await session.endSession();
    }
}

export async function acceptInvitation(projectId: string, requestId: string, userId: string) {
    
    const session = await mongoose.startSession();
    
    try {
        let membership;
        await session.withTransaction(async () => {
            const project = await Project.findOne({
                _id: projectId,
                deletedAt: null,
            }).session(session);

            if (!project) {
                throw new AppError(404, "Project not found.", "PROJECT_NOT_FOUND");
            }
            const findRequest = await ProjectJoinRequest.findOne({
                _id: requestId,
                projectId,
                userId,
                type: "INVITATION",
                status: "PENDING",
            }).session(session);
            
            if(!findRequest){
                throw new AppError(
                    404,
                    "The Request is not found",
                    "REQUEST_NOT_FOUND"
                );
            }
            
            const role = findRequest.role;
            
            const formerMembership = await ProjectMembership.findOne({
                projectId,
                userId,
                status: {
                    $in: ["LEFT", "REMOVED"]
                }
            }).session(session);
            
            if(formerMembership){
                membership = await reActivateMembership(findRequest.role, formerMembership._id, session);
            } else {
                membership = await addProjectMember({ projectId, userId, role }, session);
            }

            await ProjectJoinRequest.findByIdAndUpdate(findRequest._id, {
                $set: { status: "ACCEPTED" },
            }, { session });
        });

        return membership;
    } catch(err) {
        throw err;
    } finally {
        await session.endSession();
    }
}

async function reActivateMembership(role: "ADMIN" | "MEMBER", membershipId: mongoose.Types.ObjectId, session: mongoose.ClientSession) {
    
    const reactive = await ProjectMembership.findOneAndUpdate(
        {
            _id: membershipId,
        },
        {
            $set: {
                status: "ACTIVE",
                role: role,
                joinedAt: new Date()
            }
        },
        {
            returnDocument: "after",
            runValidators: true,
            session
        }
    );
    
    return reactive;
}

async function addProjectMember(input: AddMemberInput, session: ClientSession) {

    const { projectId, userId, role } = input;
   
    const isUserExist = await User.findOne({
        _id: userId,
    }).session(session);

    if(!isUserExist){
        throw new AppError(
            404, 
            "The requested user not found",
            "USER_NOT_FOUND"
        );
    }

    const [create] = await ProjectMembership.create([{
        projectId,
        userId,
        role,
        joinedAt: new Date(),
    }], { session });

    return create;
}



// reject the request 

//join request
export async function rejectJoinRequest(requestId: string, ownerId: string) {
    const existingRequest = await ProjectJoinRequest.findOne({
        _id: requestId,
        type: "JOIN_REQUEST",
    });

    if (!existingRequest) {
        throw new AppError(404, "The Request is not found", "REQUEST_NOT_FOUND");
    }

    // Verify the authenticated user is the owner of the project
    const project = await Project.findOne({
        _id: existingRequest.projectId,
        ownerId,
        deletedAt: null,
    });

    if (!project) {
        throw new AppError(
            403,
            "Only the project owner can reject this join request",
            "FORBIDDEN"
        );
    }

    if (existingRequest.status !== "PENDING") {
        throw new AppError(
            400,
            `Cannot reject request because it is already ${existingRequest.status.toLowerCase()}`,
            "INVALID_REQUEST_STATUS"
        );
    }

    const findAndReject = await ProjectJoinRequest.findOneAndUpdate(
        {
            _id: requestId,
            status: "PENDING",
            type: "JOIN_REQUEST",
        },
        {
            $set: { status: "REJECTED" },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    return findAndReject;
}

// Reject invitation (Only invited developer is allowed)
export async function rejectInvitation(requestId: string, userId: string) {
    const existingRequest = await ProjectJoinRequest.findOne({
        _id: requestId,
        type: "INVITATION",
    });

    if (!existingRequest) {
        throw new AppError(404, "The Invitation is not found", "REQUEST_NOT_FOUND");
    }

    // Verify the authenticated user is the invited developer
    if (existingRequest.userId.toString() !== userId) {
        throw new AppError(
            403,
            "You are not authorized to reject this invitation",
            "FORBIDDEN"
        );
    }

    if (existingRequest.status !== "PENDING") {
        throw new AppError(
            400,
            `Cannot reject invitation because it is already ${existingRequest.status.toLowerCase()}`,
            "INVALID_REQUEST_STATUS"
        );
    }

    const findAndReject = await ProjectJoinRequest.findOneAndUpdate(
        {
            _id: requestId,
            userId,
            status: "PENDING",
            type: "INVITATION",
        },
        {
            $set: { status: "REJECTED" },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    return findAndReject;
}