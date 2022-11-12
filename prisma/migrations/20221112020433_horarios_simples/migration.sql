/*
  Warnings:

  - You are about to drop the column `categoria` on the `Comercio` table. All the data in the column will be lost.
  - You are about to drop the `Horario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categorias` to the `Comercio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horario` to the `Comercio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comercio` DROP COLUMN `categoria`,
    ADD COLUMN `categorias` VARCHAR(191) NOT NULL,
    ADD COLUMN `horario` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Horario`;
