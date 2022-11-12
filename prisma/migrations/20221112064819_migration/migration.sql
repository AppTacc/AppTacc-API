/*
  Warnings:

  - You are about to drop the column `productosVegetarianos` on the `Comercio` table. All the data in the column will be lost.
  - You are about to drop the column `twitterURL` on the `Comercio` table. All the data in the column will be lost.
  - Added the required column `URL` to the `Comercio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagen` to the `Comercio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productosVeganos` to the `Comercio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Comercio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comercio` DROP COLUMN `productosVegetarianos`,
    DROP COLUMN `twitterURL`,
    ADD COLUMN `URL` VARCHAR(191) NOT NULL,
    ADD COLUMN `imagen` VARCHAR(191) NOT NULL,
    ADD COLUMN `productosVeganos` BOOLEAN NOT NULL,
    ADD COLUMN `telefono` VARCHAR(191) NOT NULL;
