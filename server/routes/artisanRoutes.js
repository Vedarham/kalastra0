import express from "express";
import { getMyArtisanProfile, updateArtisanProfile, listArtisans, getArtisanProfile, getTopCreators, followArtisan, unfollowArtisan } from "../controllers/artisanController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js"

const router = express.Router();

// Own profile
router.get("/me", authMiddleware, authorizeRoles("seller"), getMyArtisanProfile);
router.put("/me", authMiddleware, authorizeRoles("seller"), updateArtisanProfile);

// Public
router.get("/", listArtisans);
router.get("/creator/top", getTopCreators);
router.get("/:id", getArtisanProfile);

// Social
router.post("/:id/follow", authMiddleware, followArtisan);
router.post("/:id/unfollow", authMiddleware, unfollowArtisan);


export default router;
