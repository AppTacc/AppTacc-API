/*
  Warnings:

  - Changed the type of `categorias` on the `Comercio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Comercio" DROP COLUMN "categorias",
ADD COLUMN     "categorias" JSONB NOT NULL,
ALTER COLUMN "imagenURL" DROP NOT NULL,
ALTER COLUMN "facebookURL" DROP NOT NULL,
ALTER COLUMN "instagramURL" DROP NOT NULL,
ALTER COLUMN "URL" DROP NOT NULL,
ALTER COLUMN "estrellas" SET DEFAULT 0,
ALTER COLUMN "ratingPrecios" SET DEFAULT 0,
ALTER COLUMN "productosDiabeticos" SET DEFAULT false,
ALTER COLUMN "productosVeganos" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "descripcion" DROP NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "imagen" DROP NOT NULL;
