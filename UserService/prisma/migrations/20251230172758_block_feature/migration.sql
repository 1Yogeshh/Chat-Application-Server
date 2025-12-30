/*
  Warnings:

  - You are about to drop the column `blockedId` on the `BlockedUser` table. All the data in the column will be lost.
  - You are about to drop the column `blockerId` on the `BlockedUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[blockerAuthUserId,blockedAuthUserId]` on the table `BlockedUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blockedAuthUserId` to the `BlockedUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blockerAuthUserId` to the `BlockedUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlockedUser" DROP CONSTRAINT "BlockedUser_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "BlockedUser" DROP CONSTRAINT "BlockedUser_blockerId_fkey";

-- DropIndex
DROP INDEX "BlockedUser_blockerId_blockedId_key";

-- AlterTable
ALTER TABLE "BlockedUser" DROP COLUMN "blockedId",
DROP COLUMN "blockerId",
ADD COLUMN     "blockedAuthUserId" TEXT NOT NULL,
ADD COLUMN     "blockerAuthUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_blockerAuthUserId_blockedAuthUserId_key" ON "BlockedUser"("blockerAuthUserId", "blockedAuthUserId");
