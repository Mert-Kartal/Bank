import express from "express";
import AccountController from "src/controller/account.controller";
const router = express.Router();

router.post("/", AccountController.create);
router.post("/:id/deposit", AccountController.deposit);
router.post("/:id/withdraw", AccountController.withdraw);
router.get("/:id", AccountController.getById);
router.patch("/:id", AccountController.update);
router.delete("/:id", AccountController.delete);

export default router;
