import type { RequestHandler } from "express";
import { createProjectValidator, paginationValidation, updateProjectValidator } from "../validators/Project/project.validators.js";
import { createProject, deleteProject, updateProject, userProjectList } from "../services/Project/project.service.js";
import mongoose from "mongoose";



export  const projectCreateController: RequestHandler=async (req,res,next)=>{
    try {
        const userId=res.locals.userId;
        const validateData = createProjectValidator.safeParse(req.body);
        
        if (!validateData.success) {
        return res.status(400).json({
            message: "Invalid project data. Please check your input.",
            errors: validateData.error.issues,
        });
        }
        const response = await createProject(validateData.data,userId);
        
        return res.status(201).json({
            message:"Project created sucessfully",
            data: response
        })
    } catch (error) {
        next(error)
    }
}

export const userProjectListContoller : RequestHandler = async(req,res,next)=>{
    try {
        const userId = res.locals.userId;
        

        const validateData = paginationValidation.parse(req.query);
        
        const projectList = await userProjectList(userId,validateData);
        return res.status(200).json({
            success: true,
            ...projectList,
        });
    } catch (error) {
        next(error)
    }
}
export const projectDeleteContoller : RequestHandler = async(req,res,next)=>{
    try {
        const projectId = req.params.projectId;
        const ownerId = res.locals.userId;
        if (typeof projectId !== "string") {
            return res.status(400).json({
                message: "Project ID is required",
            });
        }
        if (!mongoose.isValidObjectId(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID format.",
            });
        }
        const projectDelete = await deleteProject(projectId,ownerId);
        return res.status(200).json({
            data: projectDelete,
        });
    } catch (error) {
        next(error)
    }
}
export const updateProjectController: RequestHandler = async(req,res,next)=>{
    try {
        
        const validateData = updateProjectValidator.safeParse(req.body);
        
        if(!validateData.success){
            return res.status(400).json({
            message: "Validation failed",
            errors: validateData.error.issues,
        });
        }
        const projectId = req.params.projectId;
        const userId = res.locals.userId;
        
        if (typeof projectId !== "string") {
            return res.status(400).json({
                message: "Project ID is required",
            });
        }
        if (!mongoose.isValidObjectId(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }
        const response = await updateProject(validateData.data, projectId, userId)
        return res.status(200).json({
            message: "Project updated successfully",
            data: response,
        });

    } catch (error) {
        next(error)
    }
}