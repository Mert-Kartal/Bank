import express from "express";
import UserController from "src/controller/user.controller";
import middleware from "src/middleware/auth.middleware";
const router = express.Router();

router.use(middleware.authenticate);

router.get("/user", UserController.getUser);
router.get("/", UserController.get);
router.get("/transactions", UserController.getTransactions);
router.get("/accounts", UserController.getAccounts);
router.patch("/", UserController.update);
router.delete("/", UserController.delete);

export default router;
