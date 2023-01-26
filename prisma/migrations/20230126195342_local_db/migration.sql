-- CreateTable
CREATE TABLE `Localidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `latitud` DOUBLE NOT NULL,
    `longitud` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriaComercio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comercio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `localidadId` INTEGER NULL,
    `latitud` DOUBLE NOT NULL,
    `longitud` DOUBLE NOT NULL,
    `horario` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `imagenURL` TEXT NULL,
    `facebookURL` VARCHAR(191) NULL,
    `instagramURL` VARCHAR(191) NULL,
    `URL` VARCHAR(191) NULL,
    `estrellas` INTEGER NOT NULL DEFAULT 0,
    `ratingPrecios` INTEGER NOT NULL DEFAULT 0,
    `productosDiabeticos` BOOLEAN NOT NULL DEFAULT false,
    `productosVeganos` BOOLEAN NOT NULL DEFAULT false,
    `validado` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `categoria` ENUM('Frescos', 'Panificados', 'Elaborados', 'Envasados', 'Bebidas', 'Postres', 'Snacks') NOT NULL,
    `precio` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 0,
    `imagen` VARCHAR(191) NULL,
    `validado` BOOLEAN NOT NULL DEFAULT false,
    `comercioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Horario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `apertura` INTEGER NOT NULL,
    `cierre` INTEGER NOT NULL,
    `dia` ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo') NOT NULL,
    `comercioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoriaComercioToComercio` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoriaComercioToComercio_AB_unique`(`A`, `B`),
    INDEX `_CategoriaComercioToComercio_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
