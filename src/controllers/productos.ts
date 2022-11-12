import { Router } from "express";
import joi from "joi";
import { getEnumValues } from "../util";
import { CategoriaProducto, PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();

const productoSchema = joi.object({
    nombre: joi.string().required(),
    descripcion: joi.string().required(),
    precio: joi.number().required(),
    categoria: joi.valid(...getEnumValues(CategoriaProducto)).required(),
    rating: joi.number(),
    imagen: joi.string()
});

router.post("/:id/validar", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "id invalido" });
    }

    const producto = await prisma.producto.update({
        where: {
            id
        },
        data: {
            validado: true
        }
    });

    res.status(200).json(producto);
});

router.get("/sinvalidar", async (req, res) => {
    const comercios = await prisma.comercio.findMany({
        where: {
            validado: true
        },
        include: {
            productos: {
                where: {
                    validado: false
                }
            }
        }
    });

    res.status(200).json(comercios.filter(comercio => comercio.productos && comercio.productos.length > 0));
});

export default router;