import { Router } from "express";
import {
    createTaskController,
    getProjectTasksController,
    updateTaskController,
    deleteTaskController,
    getMyProjectTasksController,
} from "../../controllers/Project/Task/projectTask.controller.js"; // Adjust relative path based on your exact folder nesting

const router = Router();

// 1. Create a task in a project
router.post("/:projectId/tasks", createTaskController);

// 2. Get all tasks for a project (with pagination & query filters)
router.get("/:projectId/tasks", getProjectTasksController);

// 3. Update a task
router.patch("/:projectId/tasks/:taskId", updateTaskController);

// 4. Delete a task
router.delete("/:projectId/tasks/:taskId", deleteTaskController);

router.get("/:projectId/my-tasks", getMyProjectTasksController);

export default router;