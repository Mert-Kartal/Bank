import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"
const prisma = new PrismaClient();
dotenv.config()
export default prisma;
