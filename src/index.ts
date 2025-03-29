import express from "express";
import userRouter from "./route/user.route";
import accountRouter from "./route/account.route";
import transactionRouter from "./route/transaction.route";
import authRouter from "./route/auth.route";
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", userRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => console.log(`Server is working on port ${PORT}!`));
