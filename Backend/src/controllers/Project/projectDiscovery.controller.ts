import type { RequestHandler } from "express";
import { getPublicProjects } from "../../services/Project/projectDiscovery.service.js";
import { publicProjectQueryValidator } from "../../validators/Project/projectDiscovery.validators.js";

export const getPublicProjectsController: RequestHandler = async (req, res, next) => {
    try {
        const queryData = publicProjectQueryValidator.parse(req.query);
        const result = await getPublicProjects(queryData);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};