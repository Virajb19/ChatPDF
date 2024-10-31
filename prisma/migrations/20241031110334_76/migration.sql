/*
  Warnings:

  - The values [USER,ASSISTANT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('user', 'assistant');
ALTER TABLE "Message" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Message" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "Message" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "role" SET DEFAULT 'user';
