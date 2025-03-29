import express from "express";
import TransactionController from "src/controller/transaction.controller";
import middleware from "src/middleware/auth.middleware";
const router = express.Router();

router.post("/", middleware.authenticate, TransactionController.create);
router.get("/:id", middleware.authenticate, TransactionController.getById);

export default router;
