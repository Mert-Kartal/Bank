import express from "express";
import AccountController from "src/controller/account.controller";
import middleware from "src/middleware/auth.middleware";
const router = express.Router();

router.use(middleware.authenticate);

router.post("/", AccountController.create);
router.post("/:id/deposit", AccountController.deposit);
router.post("/:id/withdraw", AccountController.withdraw);
router.get("/:id", AccountController.getById);
router.patch("/:id", AccountController.update);
router.delete("/:id", AccountController.delete);
router.get("/:id/transactions", AccountController.getTransactions);

export default router;
