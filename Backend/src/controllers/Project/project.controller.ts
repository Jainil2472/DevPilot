import type { RequestHandler } from "express";
import { createProjectValidator, paginationValidation, updateProjectValidator } from "../../validators/Project/project.validators.js";
import { createProject, deleteProject, updateProject, userProjectList } from "../../services/Project/project.service.js";
import mongoose from "mongoose";
import { AppError } from "../../utils/AppError.js"; 

export const projectCreateController: RequestHandler = async (req, res, next) => {
    try {
        const userId = res.locals.userId;
        
        const validateData = createProjectValidator.parse(req.body);
        
        const response = await createProject(validateData, userId);
        
        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: response
        });

    } catch (error) {
        next(error);
    }
}

export const userProjectListContoller: RequestHandler = async (req, res, next) => {
    try {
        const userId = res.locals.userId;
        
        // .parse() handles validation and type coercion cleanly
        const validateData = paginationValidation.parse(req.query);
        
        const projectList = await userProjectList(userId, validateData);
        return res.status(200).json({
            success: true,
            ...projectList,
        });
    } catch (error) {
        next(error);
    }
}

export const projectDeleteContoller: RequestHandler = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const ownerId = res.locals.userId;

        if (typeof projectId !== "string" || !projectId) {
            throw new AppError(400, "Project ID is required");
        }

        if (!mongoose.isValidObjectId(projectId)) {
            throw new AppError(400, "Invalid project ID format.");
        }

        const projectDelete = await deleteProject(projectId, ownerId);
        return res.status(200).json({
            success: true,
            data: projectDelete,
        });
    } catch (error) {
        next(error);
    }
}

export const updateProjectController: RequestHandler = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const userId = res.locals.userId;

        if (typeof projectId !== "string" || !projectId) {
            throw new AppError(400, "Project ID is required");
        }

        if (!mongoose.isValidObjectId(projectId)) {
            throw new AppError(400, "Invalid project ID format");
        }

        // .parse() throws automatically if validation fails
        const validateData = updateProjectValidator.parse(req.body);

        const response = await updateProject(validateData, projectId, userId);
        
        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: response,
        });
    } catch (error) {
        next(error);
    }
}