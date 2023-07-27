-- AlterTable
ALTER TABLE `Link` MODIFY `userId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Link_userId_idx` ON `Link`(`userId`);
