import express from "express";
import TransactionController from "src/controller/transaction.controller";
import middleware from "src/middleware/auth.middleware";
import trxMiddleware from "src/middleware/transaction.middleware";
const router = express.Router();

router.use(middleware.authenticate);

router.post(
  "/:id",
  trxMiddleware.validateTransaction,
  TransactionController.create
);
router.get("/:id", TransactionController.getById);

export default router;
