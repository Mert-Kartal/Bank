import express from "express";
import AccountController from "src/controller/account.controller";
import middleware from "src/middleware/auth.middleware";
const router = express.Router();

router.post("/", middleware.authenticate, AccountController.create);
router.post("/:id/deposit", middleware.authenticate, AccountController.deposit);
router.post(
  "/:id/withdraw",
  middleware.authenticate,
  AccountController.withdraw
);
router.get("/:id", middleware.authenticate, AccountController.getById);
router.get(
  "/:id/transactions",
  middleware.authenticate,
  AccountController.getTransactions
);
router.patch("/:id", middleware.authenticate, AccountController.update);
router.delete("/:id", middleware.authenticate, AccountController.delete);

export default router;
