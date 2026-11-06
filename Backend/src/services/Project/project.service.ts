import { Project } from "../../models/project.model.js";
import type { createProjectValidator, updateProjectValidator } from "../../validators/Project/project.validators.js";
import {z} from 'zod'

export async function createProject(input: z.infer<typeof createProjectValidator>) {

    const {name,description,visibility,techStack,userId} = input;
    
    const duplicate = await Project.findOne({
        name,
        ownerId: userId
    });

    if(duplicate){
        throw new Error("DUPLICATE_PROJECT")
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

export async function userProjectList(ownerId: string) {

    const userProject = await Project.find({
        ownerId: ownerId
    });
    return userProject;
    
}

export async function updateProject(input: z.infer<typeof updateProjectValidator>, projectId: string, userId: string){
    
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
        throw new Error("Project not found");
    }

    return update;
}

export async function deleteProject(projectId: string,ownerId: string){

    const deleteProject = await Project.findByIdAndDelete(
        {
            _id: projectId,
            ownerId: ownerId,
        }
    )

    if(!deleteProject){
        throw new Error("the project doesnot exsist");
    }
    return deleteProject;

}