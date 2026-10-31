import type { RequestHandler } from "express";
import { createProjectValidator } from "../validators/Project/project.validators.js";
import { createProject } from "../services/Project/project.service.js";



export  const projectController: RequestHandler=async (req,res,next)=>{
    const body = { ...req.body, userId: res.locals.userId}
    try {

        const validateData = createProjectValidator.safeParse(body);
        if (!validateData.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validateData.error.issues,
        });
        }
        await createProject(validateData.data);
        return res.status(201).json({
            message:"Project created sucessfully"
        })
    } catch (error) {
        console.log("something went wrong in controller and service");
        next(error)
    }
}