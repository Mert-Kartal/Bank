import express from "express";
import TransactionController from "src/controller/transaction.controller";
const router = express.Router();

router.post("/:id", TransactionController.create);
router.get("/:id", TransactionController.getById);

export default router;
