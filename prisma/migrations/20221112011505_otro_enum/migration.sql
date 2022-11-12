/*
  Warnings:

  - You are about to alter the column `localidad` on the `Comercio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - The values [lunes,martes,miercoles,jueves,viernes,sabado,domingo] on the enum `Horario_diaSemana` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `CategoriaComercio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoria` to the `Comercio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comercio` ADD COLUMN `categoria` ENUM('Restaurante', 'Bar', 'Cafe', 'Takeaway') NOT NULL,
    MODIFY `localidad` ENUM('MarDelPlata', 'Chapadmalal', 'Batan') NOT NULL;

-- AlterTable
ALTER TABLE `Horario` MODIFY `diaSemana` ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo') NOT NULL;

-- DropTable
DROP TABLE `CategoriaComercio`;
