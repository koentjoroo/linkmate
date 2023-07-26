/*
  Warnings:

  - You are about to drop the column `salt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `salt`,
    ADD COLUMN `passwordSalt` VARCHAR(191) NULL;
