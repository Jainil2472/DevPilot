import { Project } from "../../models/project.model.js";
import type { createProjectValidator, paginationValidation, updateProjectValidator } from "../../validators/Project/project.validators.js";
import {z} from 'zod'

export async function createProject(input: z.infer<typeof createProjectValidator>,userId: string) {

    const {name,description,visibility,techStack} = input;
    const duplicate = await Project.findOne({
        name,
        ownerId: userId
    });

    if(duplicate){
        throw new Error("A project with this name already exists in your account.")
    }

    const create = await Project.insertOne({
        name,
        description,
        ownerId: userId,
        visibility,
        techStack
    })
    return create
}


export async function userProjectList(ownerId: string, input: z.infer<typeof paginationValidation>) {

    const page = input.page;
    const limit = input.limit;
    const skip = (page-1)* limit;


    const userProject = await Project.find({
        ownerId: ownerId
    })
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .lean();


    const totalProject = await Project.countDocuments({
        ownerId: ownerId      
    });

    const totalPage = Math.ceil(
        totalProject/limit
    );

    return {
        userProject,
        pagination:{
            currentPage : page,
            limit,
            totalProject,
            totalPage,
            hasNextPage: page < totalPage,
            hasPreviousPage: page > 1,
        }

    };
    
}

export async function updateProject(input: z.infer<typeof updateProjectValidator>, projectId: string, userId: string){
    
    if(input.name){
        const duplicate = await Project.findOne(
            {
                _id : {$ne: projectId},
                ownerId: userId,
                name: input.name
            }
        )
        if(duplicate){
            throw new Error("DUPLICATE_PROJECT");
        }
    }
    const update = await Project.findOneAndUpdate(
        {
            _id: projectId,
            ownerId: userId,

        },
        {
            $set: input
        },
        {
            returnDocument:"after",
            runValidators: true,
        }
    )
    if (!update) {
        throw new Error("Project not found or you do not have permission to access it.");
    }

    return update;
}

export async function deleteProject(projectId: string,ownerId: string){

    const deleteProject = await Project.findOneAndDelete(
        {
            _id: projectId,
            ownerId,
        }
    )

    if(!deleteProject){
        throw new Error("the project doesnot exsist");
    }
    return deleteProject;

}