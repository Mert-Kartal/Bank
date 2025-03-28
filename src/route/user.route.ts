import express from "express";
import UserController from "src/controller/user.controller";
const router = express.Router();

router.post("/", UserController.create);
router.get("/:id", UserController.getById);
router.get("/", UserController.get);
router.get("/:id/transactions", UserController.getTransactions);
router.get("/:id/accounts", UserController.getAccounts);
router.patch("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;
