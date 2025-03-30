import express from "express";
import authController from "src/controller/auth.controller";
import middleware from "src/middleware/auth.middleware";
const router = express.Router();

router.use(middleware.authenticate);

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
