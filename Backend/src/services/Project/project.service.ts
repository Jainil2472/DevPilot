import { Project } from "../../models/project.model.js";
import type { createProjectValidator, paginationValidation, updateProjectValidator } from "../../validators/Project/project.validators.js";
import { z } from 'zod';
import { AppError } from "../../utils/AppError.js";
import { createOwnerMembership } from "./projectMembership.service.js";
import { createOwner } from "../../validators/Project/projectMembership.validators.js";
import mongoose from "mongoose";

export async function createProject(input: z.infer<typeof createProjectValidator>, userId: string) {
    const { name, description, visibility, techStack } = input;
    
    const duplicate = await Project.findOne({
        name,
        ownerId: userId,
        deletedAt: null
    });

    if (duplicate) {
    throw new AppError(
        409,
        "A project with this name already exists in your account.",
        "DUPLICATE_PROJECT"
    );
    }
    const session = await mongoose.startSession();


    try {

        let project;
        
        await session.withTransaction( async () => {
            
            const newProject = await Project.create([{
                name,
                description,
                ownerId: userId,
                visibility,
                techStack
            }],{session});
            project = newProject[0];
            if (!project) {
                throw new AppError(500, "Failed to create project document.");
            }
            const memberData = {
                projectId:project._id.toString(),
                userId: userId,
                role: "OWNER"
            };
            const validateData = createOwner.parse(memberData);
            await createOwnerMembership(validateData,session);
            
            
        });
        

    return project;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        throw new AppError(500, "Failed to create project and membership records.", "TRANSACTION_FAILED");
    }

    
    
}

export async function userProjectList(ownerId: string, input: z.infer<typeof paginationValidation>) {
    const page = input.page;
    const limit = input.limit;
    const skip = (page - 1) * limit;
    const filter = {
        ownerId: ownerId,
        deletedAt: null,
    }
    const userProject = await Project.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const totalProject = await Project.countDocuments(filter);

    const totalPage = Math.ceil(
        totalProject / limit
    );

    return {
        userProject,
        pagination: {
            currentPage: page,
            limit,
            totalProject,
            totalPage,
            hasNextPage: page < totalPage,
            hasPreviousPage: page > 1,
        }
    };
}

export async function updateProject(input: z.infer<typeof updateProjectValidator>, projectId: string, userId: string) {
    if (input.name) {
        const duplicate = await Project.findOne({
            _id: { $ne: projectId },
            ownerId: userId,
            name: input.name,
            deletedAt: null,
        });
        
        if (duplicate) {
            throw new AppError(
                409,
                "A project with this name already exists in your account.",
                "DUPLICATE_PROJECT"
            );
        }
    }

    const update = await Project.findOneAndUpdate(
        {
            _id: projectId,
            ownerId: userId,
            deletedAt: null,
        },
        {
            $set: input
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );  

    if (!update) {
        throw new AppError(404, "Project not found or you do not have permission to access it.");
    }

    return update;
}

export async function deleteProject(projectId: string, ownerId: string) {
    const deletedProject = await Project.findOneAndUpdate(
        {
            _id: projectId,
            ownerId,
            deletedAt: null
        },
        {
            $set: {
                deletedAt: new Date()
            }
        },
        {
            returnDocument:"after"
        }
    );

    if (!deletedProject) {
        throw new AppError(404, "The project does not exist or you do not have permission to delete it.", "PROJECT_NOT_FOUND");
    }
    
    return deletedProject;
}