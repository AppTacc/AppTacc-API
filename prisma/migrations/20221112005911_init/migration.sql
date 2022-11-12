-- CreateTable
CREATE TABLE `Comercio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `localidad` VARCHAR(191) NOT NULL,
    `latitud` DOUBLE NOT NULL,
    `longitud` DOUBLE NOT NULL,
    `facebookURL` VARCHAR(191) NOT NULL,
    `instagramURL` VARCHAR(191) NOT NULL,
    `twitterURL` VARCHAR(191) NOT NULL,
    `estrellas` INTEGER NOT NULL,
    `ratingPrecios` INTEGER NOT NULL,
    `productosDiabeticos` BOOLEAN NOT NULL,
    `productosVegetarianos` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `categoria` ENUM('Frescos', 'Panificados', 'Elaborados', 'Envasados', 'Bebidas', 'Postres', 'Snacks') NOT NULL,
    `precio` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `imagen` VARCHAR(191) NOT NULL,
    `comercioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriaComercio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comercioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Horario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `horarioApertura` INTEGER NOT NULL,
    `horarioCierre` INTEGER NOT NULL,
    `diaSemana` ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    `abre` BOOLEAN NOT NULL,
    `comercioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
