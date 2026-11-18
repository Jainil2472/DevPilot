import { Project } from "../../models/project.model.js";
import type { z } from "zod";
import type { publicProjectQueryValidator } from "../../validators/Project/projectDiscovery.validators.js";

export async function getPublicProjects(input: z.infer<typeof publicProjectQueryValidator>) {
    const { page, limit, search, techStack } = input;
    const skip = (page - 1) * limit;

    // Base filter: only active public projects
    const filter: Record<string, unknown> = {
        visibility: "PUBLIC",
        deletedAt: null,
    };

    // If a search term is provided, filter by project name (case-insensitive regex)
    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    // If techStack filter is provided, match projects containing those technologies
    if (techStack && techStack.length > 0) {
        filter.techStack = { $in: techStack };
    }

    const projects = await Project.find(filter)
        .populate("ownerId", "username email") // Populate owner info so developers see who owns it
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalProjects = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalProjects / limit);

    return {
        projects,
        pagination: {
            currentPage: page,
            limit,
            totalProjects,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
}