import express from "express";
import authController from "src/controller/auth.controller";
import middleware from "src/middleware/auth.middleware";
const router = express.Router();

router.post("/register", middleware.validateRegister, authController.register);
router.post("/login", middleware.validateLogin, authController.login);

export default router;
