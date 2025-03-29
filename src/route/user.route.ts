import express from "express";
import UserController from "src/controller/user.controller";
import middleware from "src/middleware/auth.middleware";
const router = express.Router();

router.get("/:id", middleware.authenticate, UserController.getById);
router.get("/", middleware.authenticate, UserController.get);
router.get(
  "/:id/transactions",
  middleware.authenticate,
  UserController.getTransactions
);
router.get(
  "/:id/accounts",
  middleware.authenticate,
  UserController.getAccounts
);
router.patch("/:id", middleware.authenticate, UserController.update);
router.delete("/:id", middleware.authenticate, UserController.delete);

export default router;
