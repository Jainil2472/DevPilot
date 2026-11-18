import type z from "zod";
import { AppError } from "../../../utils/AppError.js";
import { ProjectMembership } from "../../../models/projectMembership.model.js";
import { Task } from "../../../models/task.model.js";
import { Project } from "../../../models/project.model.js";
import type { 
    createTaskValidator, 
    taskQueryValidator, 
    updateTaskValidator 
} from "../../../validators/Project/Task/task.validators.js";

// Helper to verify project exists and get user membership
async function verifyProjectMembership(projectId: string, userId: string) {
    const project = await Project.findOne({ _id: projectId, deletedAt: null });
    if (!project) {
        throw new AppError(404, "Project not found.", "PROJECT_NOT_FOUND");
    }

    const membership = await ProjectMembership.findOne({
        projectId,
        userId,
        status: "ACTIVE",
    });

    // If it's a private project and they aren't a member, block them completely.
    if (!membership && project.visibility === "PRIVATE") {
        throw new AppError(403, "You must be an active project member to access tasks.", "FORBIDDEN");
    }

    return membership; // Returns the membership doc, or null if it's a PUBLIC project and they aren't a member
}

// 1. Create Task
export async function createTask(
    projectId: string,
    userId: string,
    input: z.infer<typeof createTaskValidator>
) {
    // Reused helper! 
    const membership = await verifyProjectMembership(projectId, userId);

    // Block non-members from creating tasks (even in public projects)
    if (!membership) {
        throw new AppError(403, "Only active project members can create tasks.", "FORBIDDEN");
    }

    if (input.assigneeId) {
        const assigneeMembership = await ProjectMembership.findOne({
            projectId,
            userId: input.assigneeId,
            status: "ACTIVE",
        });

        if (!assigneeMembership) {
            throw new AppError(400, "Assignee must be an active member of this project.", "INVALID_ASSIGNEE");
        }
    }

    const payload: any = {
        projectId,
        createdBy: userId,
        ...input,
    };

    const task = await Task.create(payload);

    return task;
}

// 2. Get Project Tasks with Pagination & Filtering
export async function getProjectTasks(
    projectId: string,
    userId: string, 
    query: z.infer<typeof taskQueryValidator>
) {
    // Reused helper! (Allows non-members to view if project is PUBLIC)
    await verifyProjectMembership(projectId, userId);

    const { page, limit, status, priority } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { projectId };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
        .populate("createdBy", "username email")
        .populate("assigneeId", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);

    return {
        tasks,
        pagination: {
            currentPage: page,
            limit,
            totalTasks,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
}

// 3. Update Task
export async function updateTask(
    projectId: string,
    taskId: string,
    userId: string,
    input: z.infer<typeof updateTaskValidator>
) {
    // Reused helper!
    const membership = await verifyProjectMembership(projectId, userId);

    if (!membership) {
        throw new AppError(403, "You must be an active project member to update tasks.", "FORBIDDEN");
    }

    const task = await Task.findOne({ _id: taskId, projectId });
    if (!task) {
        throw new AppError(404, "Task not found.", "TASK_NOT_FOUND");
    }

    // Authorization check: Only OWNER, ADMIN, the task creator, or the assignee can update
    const isPrivileged = ["OWNER", "ADMIN"].includes(membership.role);
    const isCreator = task.createdBy.toString() === userId;
    const isAssignee = task.assigneeId && task.assigneeId.toString() === userId;

    if (!isPrivileged && !isCreator && !isAssignee) {
        throw new AppError(403, "You do not have permission to update this task.", "FORBIDDEN");
    }

    const updatePayload: any = { ...input };

    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, projectId },
        { $set: updatePayload },
        { returnDocument: "after", runValidators: true }
    )
        .populate("createdBy", "username email")
        .populate("assigneeId", "username email");

    return updatedTask;
}

// 4. Delete Task
export async function deleteTask(projectId: string, taskId: string, userId: string) {
    // Reused helper!
    const membership = await verifyProjectMembership(projectId, userId);

    if (!membership) {
        throw new AppError(403, "You must be an active project member to delete tasks.", "FORBIDDEN");
    }

    const task = await Task.findOne({ _id: taskId, projectId });
    if (!task) {
        throw new AppError(404, "Task not found.", "TASK_NOT_FOUND");
    }

    // Authorization check: Only OWNER, ADMIN, or the task creator can delete
    const isPrivileged = ["OWNER", "ADMIN"].includes(membership.role);
    const isCreator = task.createdBy.toString() === userId;

    if (!isPrivileged && !isCreator) {
        throw new AppError(403, "You do not have permission to delete this task.", "FORBIDDEN");
    }

    await Task.deleteOne({ _id: taskId });
    return { message: "Task deleted successfully" };
}

export async function getMyProjectTasks(
    projectId: string,
    userId: string,
    query: z.infer<typeof taskQueryValidator>
) {
    // Verify project exists and user has access
    await verifyProjectMembership(projectId, userId);

    const { page, limit, status, priority } = query;
    const skip = (page - 1) * limit;

    // Filter strictly by projectId AND the logged-in user's ID
    const filter: Record<string, unknown> = { 
        projectId, 
        assigneeId: userId 
    };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
        .populate("createdBy", "username email")
        .populate("assigneeId", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);

    return {
        tasks,
        pagination: {
            currentPage: page,
            limit,
            totalTasks,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
}