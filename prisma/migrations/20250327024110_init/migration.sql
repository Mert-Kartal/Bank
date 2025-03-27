-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "deletedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "deletedAt" DROP DEFAULT;
