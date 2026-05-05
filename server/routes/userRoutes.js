import express from "express";
import { deleteProfile, switchToArtisan, changePassword, uploadAvatar } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.delete("/delete", authMiddleware, deleteProfile);
router.put("/switch-artisan", authMiddleware, switchToArtisan);
router.put("/change-password",authMiddleware, changePassword);
router.put("/avatar", authMiddleware, upload.single("avatar"), uploadAvatar)

// Only admin
// router.delete("/users/:id",
//   authMiddleware,
//   authorizeRoles("admin"),
//   deleteUser
// );

export default router;
