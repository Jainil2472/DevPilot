import type z from "zod";
import { Project } from "../../../models/project.model.js";
import { ProjectJoinRequest } from "../../../models/projectJoinRequest.model.js";
import { ProjectMembership } from "../../../models/projectMembership.model.js";
import { User } from "../../../models/user.model.js";
import { AppError } from "../../../utils/AppError.js";
import type { requestQueryValidator } from "../../../validators/Project/Membership/projectMembershipRequest.validators.js";

//request creation service 
//join request service
export async function createJoinRequest(
    projectId: string,
    userId: string,
    role: "ADMIN" | "MEMBER",
    message?: string
) {
    const project = await Project.findOne({
        _id: projectId,
        deletedAt: null,
        visibility: "PUBLIC",
    });

    if (!project) {
        throw new AppError(
            404,
            "Public project not found.",
            "PROJECT_NOT_FOUND"
        );
    }
    if (project.ownerId.toString() === userId) {
        throw new AppError(
            400,
            "Project owner cannot request to join their own project.",
            "OWNER_CANNOT_JOIN"
        );
    }

    const existingMembership = await ProjectMembership.findOne({
        projectId,
        userId,
        status: "ACTIVE",
    });

    if (existingMembership) {
        throw new AppError(
            409,
            "You are already a member of this project.",
            "ALREADY_MEMBER"
        );
    }

    const existingRequest = await ProjectJoinRequest.findOne({
        projectId,
        userId,
        type: "JOIN_REQUEST",
        status: "PENDING",
    });

    if (existingRequest) {
        throw new AppError(
            409,
            "You already have a pending join request.",
            "REQUEST_ALREADY_EXISTS"
        );
    }

    return await ProjectJoinRequest.create({
        projectId,
        userId,
        initiatedBy: userId,
        role,
        type: "JOIN_REQUEST",
        status: "PENDING",
        ...(message && { message})
    });
}

//invitation service
export async function createInvitation(
    projectId: string,
    initiaterId: string,
    userId: string,
    role: "ADMIN" | "MEMBER",
    message?: string,
    
) {
    const project = await Project.findOne({
        _id: projectId,
        deletedAt: null,
    });

    if (!project) {
        throw new AppError(
            404,
            "Public project not found.",
            "PROJECT_NOT_FOUND"
        );
    }

    if (project.ownerId.toString() !== initiaterId) {
        throw new AppError(
            403,
            "Only the project owner can invite developers.",
            "FORBIDDEN"
        );
    }

    if (initiaterId === userId) {
        throw new AppError(400, "Project owner cannot invite themselves.", "CANNOT_INVITE_SELF");
    }
    const invitedUser = await User.findById(userId);
    if (!invitedUser) {
        throw new AppError(404, "Invited user not found.", "USER_NOT_FOUND");
    }
    const existingMembership = await ProjectMembership.findOne({
        projectId,
        userId,
        status: "ACTIVE",
    });

    if (existingMembership) {
        throw new AppError(
            409,
            "You are already a member of this project.",
            "ALREADY_MEMBER"
        );
    }

    const existingRequest = await ProjectJoinRequest.findOne({
        projectId,
        userId,
        type: "INVITATION",
        status: "PENDING",
    });

    if (existingRequest) {
        throw new AppError(
            409,
            "You already have a pending join request.",
            "REQUEST_ALREADY_EXISTS"
        );
    }

    return await ProjectJoinRequest.create({
        projectId,
        userId,
        initiatedBy: initiaterId,
        role,
        type: "INVITATION",
        status: "PENDING",
        ...(message && {message}),
    });
}




//request cancellation service
// cancle join request service
export async function cancleJoinRequest(
    requestId: string,
    userId: string,
){

    const findRequest = await ProjectJoinRequest.findOne({
        _id: requestId,
        type: "JOIN_REQUEST",
    });
    if(!findRequest){
        throw new AppError(
            404,
            "Request not found",
            "REQUEST_NOT_FOUND"
        );
    }
    if(findRequest.initiatedBy.toString() !== userId){
        throw new AppError(
            404,
            "You are not eligible to acess this request",
            "UNATHORIZED_ACESS"
        );
    }
    if(findRequest.status.toString() !== "PENDING"){
        throw new AppError(
            404,
            "Your request is accepted or rejected you can not cancell this request",
            "REQUEST_AACCEPTED_OR_REJECTED"
        );
    }


    const cancleRequest = await ProjectJoinRequest.findOneAndUpdate(
        {
            _id: requestId,
            initiatedBy: userId,
            type: "JOIN_REQUEST",
        },
        {
            $set:{
                status:"CANCELLED"
            }
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    )
    return cancleRequest;
}

// cancle invitation service
export async function cancleInvitation(
    requestId: string,
    ownerId: string,
){

    const findRequest = await ProjectJoinRequest.findOne({
        _id: requestId,
        type: "INVITATION",
    });

    if(!findRequest){
        throw new AppError(
            404,
            "Request not found",
            "REQUEST_NOT_FOUND"
        );
    }
    if(findRequest.initiatedBy.toString() !== ownerId){
        throw new AppError(
            404,
            "You are not eligible to acess this request",
            "UNATHORIZED_ACESS"
        );
    }
    if(findRequest.status.toString() !== "PENDING"){
        throw new AppError(
            404,
            "Your request is accepted or rejected you can not cancell this request",
            "REQUEST_AACCEPTED_OR_REJECTED"
        );
    }


    const cancleRequest = await ProjectJoinRequest.findOneAndUpdate(
        {
            _id: requestId,
            initiatedBy: ownerId,
            type: "INVITATION",
        },
        {
            $set:{
                status:"CANCELLED"
            }
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    )
    return cancleRequest;   
}







export async function getSentJoinRequests(
    userId: string,
    query: z.infer<typeof requestQueryValidator>
) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
        userId,
        type: "JOIN_REQUEST",
    };
    if (status) filter.status = status;

    const requests = await ProjectJoinRequest.find(filter)
        .populate("projectId", "name description visibility status techStack")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalRequests = await ProjectJoinRequest.countDocuments(filter);
    const totalPages = Math.ceil(totalRequests / limit);

    return {
        requests,
        pagination: {
            currentPage: page,
            limit,
            totalRequests,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
}

// 2. Get incoming invitations for the user
export async function getIncomingInvitations(
    userId: string,
    query: z.infer<typeof requestQueryValidator>
) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
        userId,
        type: "INVITATION",
    };
    if (status) filter.status = status;

    const invitations = await ProjectJoinRequest.find(filter)
        .populate("projectId", "name description visibility status techStack")
        .populate("initiatedBy", "username email") // Owner who sent the invitation
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalInvitations = await ProjectJoinRequest.countDocuments(filter);
    const totalPages = Math.ceil(totalInvitations / limit);

    return {
        invitations,
        pagination: {
            currentPage: page,
            limit,
            totalInvitations,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
}