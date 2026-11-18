import type { RequestHandler } from "express";
import * as taskService from "../../../services/Project/Task/projectTask.service.js";
import { 
    createTaskValidator, 
    updateTaskValidator, 
    taskQueryValidator,
    projectParamValidator,
    taskParamValidator
} from "../../../validators/Project/Task/task.validators.js";

export const createTaskController: RequestHandler = async (req, res, next) => {
    try {
        const userId = res.locals.userId;
        
        // Validates req.params directly!
        const { projectId } = projectParamValidator.parse(req.params);
        const validatedData = createTaskValidator.parse(req.body);

        const task = await taskService.createTask(projectId, userId, validatedData);

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

export const getProjectTasksController: RequestHandler = async (req, res, next) => {
    try {
        const userId = res.locals.userId;
        
        const { projectId } = projectParamValidator.parse(req.params);
        const queryData = taskQueryValidator.parse(req.query);

        const result = await taskService.getProjectTasks(projectId, userId, queryData);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTaskController: RequestHandler = async (req, res, next) => {
    try {
        const userId = res.locals.userId;
        
        // Validates both IDs from the URL at once!
        const { projectId, taskId } = taskParamValidator.parse(req.params);
        const validatedData = updateTaskValidator.parse(req.body);

        const updatedTask = await taskService.updateTask(projectId, taskId, userId, validatedData);

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTaskController: RequestHandler = async (req, res, next) => {
    try {
        const userId = res.locals.userId;
        
        const { projectId, taskId } = taskParamValidator.parse(req.params);

        const result = await taskService.deleteTask(projectId, taskId, userId);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyProjectTasksController: RequestHandler = async (req, res, next) => {
    try {
        // Securely retrieved from res.locals, never from req.params or req.body
        const userId = res.locals.userId;
        
        const { projectId } = projectParamValidator.parse(req.params);
        const queryData = taskQueryValidator.parse(req.query);

        const result = await taskService.getMyProjectTasks(projectId, userId, queryData);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};