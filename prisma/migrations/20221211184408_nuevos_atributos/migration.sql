/*
  Warnings:

  - You are about to drop the column `categorias` on the `Comercio` table. All the data in the column will be lost.
  - You are about to drop the column `localidad` on the `Comercio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comercio" DROP COLUMN "categorias",
DROP COLUMN "localidad",
ADD COLUMN     "localidadId" INTEGER;

-- DropEnum
DROP TYPE "Localidad";

-- CreateTable
CREATE TABLE "Localidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaComercio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "CategoriaComercio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoriaComercioToComercio" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriaComercioToComercio_AB_unique" ON "_CategoriaComercioToComercio"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriaComercioToComercio_B_index" ON "_CategoriaComercioToComercio"("B");
