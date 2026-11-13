import type z from "zod";
import type { addMember, createOwner } from "../../validators/Project/projectMembership.validators.js";
import { ProjectMembership } from "../../models/projectMembership.model.js";
import { Project } from "../../models/project.model.js";
import { AppError } from "../../utils/AppError.js";
import { User } from "../../models/user.model.js";
import type mongoose from "mongoose";


async function addProjectMember(input: z.infer<typeof addMember>, ownerId: string) {

    const {projectId, userId, role} = input;

    const isProjectExist = await Project.findOne({
        _id: projectId,
        ownerId: ownerId,
        deletedAt: null
    })
    if(!isProjectExist){
        throw new AppError(
            404, 
            "Project not found or you do not have permission to access it.",
            "PROJECT_NOT_FOUND"
        )
    }
    
    const isUserExist = await User.findOne({
        _id: userId,
    })
    if(!isUserExist){
        throw new AppError(
            404, 
            "the Requested user not found ",
            "USER_NOT_FOUND"
        )
    }

    const create = await ProjectMembership.create({
        projectId,
        userId,
        role,
        joinedAt: new Date(),
    });
    return create;
} 
export async function createOwnerMembership(input: z.infer<typeof createOwner>,session: mongoose.ClientSession) {

    const {projectId, userId, role} = input;

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
        )
    }
    
    const createMembership = await ProjectMembership.create([{
        projectId,
        userId,
        role,
        joinedAt: new Date(),
    }], { session });
    return createMembership;
} 

export async function approveJoinRequest(input: z.infer<typeof addMember>, ownerId: string){

    const {projectId, userId, role} = input

    const formerMembership = await ProjectMembership.findOne({
        projectId,
        userId,
        status: {
            $in: ["LEFT","REMOVED"]
        }
    })

    if(formerMembership){
        return await reActivateMembership(role,formerMembership._id);
    }
    return await addProjectMember(input,ownerId);
}
export async function acceptInvitation(input: z.infer<typeof addMember>, ownerId: string){
    const {projectId, userId, role} = input

    const formerMembership = await ProjectMembership.findOne({
        projectId,
        userId,
        status: {
            $in: ["LEFT","REMOVED"]
        }
    })

    if(formerMembership){
        return await reActivateMembership(role,formerMembership._id);
    }
    return await addProjectMember(input,ownerId);
}
async function reActivateMembership(role: string, membershipId: object){

    const reactive = await ProjectMembership.findOneAndUpdate(
        {
            _id : membershipId
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
        }
    );
    return reactive;
}

