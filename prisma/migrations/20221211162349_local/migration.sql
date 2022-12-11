-- CreateEnum
CREATE TYPE "Localidad" AS ENUM ('MarDelPlata', 'Chapadmalal', 'Batan');

-- CreateEnum
CREATE TYPE "CategoriaProducto" AS ENUM ('Frescos', 'Panificados', 'Elaborados', 'Envasados', 'Bebidas', 'Postres', 'Snacks');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo');

-- CreateTable
CREATE TABLE "Comercio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categorias" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "localidad" "Localidad" NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "horario" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "imagenURL" TEXT NOT NULL,
    "facebookURL" TEXT NOT NULL,
    "instagramURL" TEXT NOT NULL,
    "URL" TEXT NOT NULL,
    "estrellas" INTEGER NOT NULL,
    "ratingPrecios" INTEGER NOT NULL,
    "productosDiabeticos" BOOLEAN NOT NULL,
    "productosVeganos" BOOLEAN NOT NULL,
    "validado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Comercio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" "CategoriaProducto" NOT NULL,
    "precio" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "imagen" TEXT NOT NULL,
    "validado" BOOLEAN NOT NULL DEFAULT false,
    "comercioId" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" SERIAL NOT NULL,
    "apertura" INTEGER NOT NULL,
    "cierre" INTEGER NOT NULL,
    "dia" "DiaSemana" NOT NULL,
    "comercioId" INTEGER NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);
