import { Router } from "express";

import { getProfile } from "../controllers/profile.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";
import { getAllUsers } from "../controllers/profile.controller.js";

const profileRouter = Router();

profileRouter.get("/profile", authMiddleware, getProfile);
profileRouter.get("/admin/users", authMiddleware, authorizeRoles("admin"), getAllUsers);

export default profileRouter;



// import { Router } from "express";

// import { getProfile } from "../controllers/profile.controller.js";
// import { authMiddleware } from "../middleware/auth.middleware.js";

// const profileRouter = Router();

// profileRouter.get("/profile", authMiddleware, getProfile);

// export default profileRouter;