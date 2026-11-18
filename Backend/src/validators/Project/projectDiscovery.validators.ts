import { z } from "zod";

export const publicProjectQueryValidator = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(), // Search by project name
    techStack: z.preprocess(
        (val) => (typeof val === "string" ? val.split(",").map(s => s.trim()) : val),
        z.array(z.string()).optional()
    ), // Filter by tech stack (e.g., ?techStack=React,Node.js)
});