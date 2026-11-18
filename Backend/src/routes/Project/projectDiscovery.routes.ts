import { Router } from "express";
import { getPublicProjectsController } from "../../controllers/Project/projectDiscovery.controller.js";

const router = Router();

// GET /projects/public?page=1&limit=10&search=DevPilot&techStack=TypeScript
router.get("/public", getPublicProjectsController);

export default router;