/*
  Warnings:

  - You are about to drop the column `imagen` on the `Comercio` table. All the data in the column will be lost.
  - Added the required column `imagenURL` to the `Comercio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comercio` DROP COLUMN `imagen`,
    ADD COLUMN `imagenURL` VARCHAR(191) NOT NULL;
