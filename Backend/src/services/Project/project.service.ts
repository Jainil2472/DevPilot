import { Project } from "../../models/project.model.js";
import type { createProjectValidator } from "../../validators/Project/project.validators.js";
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