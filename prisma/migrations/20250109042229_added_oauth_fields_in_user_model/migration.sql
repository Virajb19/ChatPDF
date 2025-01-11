/*
  Warnings:

  - The values [user,assistant] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OauthProvider" AS ENUM ('GOOGLE', 'GITHUB');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ASSISTANT');
ALTER TABLE "Message" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Message" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "Message" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropIndex
DROP INDEX "User_token_key";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "role" SET DEFAULT 'USER';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "token",
ADD COLUMN     "OauthId" TEXT,
ADD COLUMN     "OauthProvider" "OauthProvider";
