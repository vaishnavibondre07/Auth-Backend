import { Router } from "express";

import { getProfile, getAllUsers, getUserFilesByAdmin } from "../controllers/profile.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";


const profileRouter = Router();

profileRouter.get("/profile", authMiddleware, getProfile);
profileRouter.get("/admin/users", authMiddleware, authorizeRoles("admin"), getAllUsers);
profileRouter.get("/admin/users/:id/files", authMiddleware, authorizeRoles("admin"), getUserFilesByAdmin);

export default profileRouter;

