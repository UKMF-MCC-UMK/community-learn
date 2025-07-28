/*
  Warnings:

  - You are about to drop the column `content` on the `materi` table. All the data in the column will be lost.
  - Made the column `contentUrl` on table `materi` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `materi` DROP COLUMN `content`,
    ADD COLUMN `contentType` VARCHAR(191) NOT NULL DEFAULT 'link',
    ADD COLUMN `metadata` VARCHAR(191) NULL,
    MODIFY `contentUrl` VARCHAR(191) NOT NULL;
