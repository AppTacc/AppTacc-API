import router from "./comercio";
import joi from "joi";
import { getEnumValues } from "../util";
import { CategoriaProducto, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const productoSchema = joi.object({
    nombre: joi.string().required(),
    descripcion: joi.string().required(),
    precio: joi.number().required(),
    categoria: joi.valid(...getEnumValues(CategoriaProducto)).required(),
    rating: joi.number(),
    imagen: joi.string()
});

router.post("/:id/productos", async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "id invalido" });
    }

    const comercio = await prisma.comercio.findUnique({
        where: {
            id: id
        }

    });

    if (!comercio) {
        return res.status(404).json({ error: "Comercio no encontrado" });
    }

    const body = productoSchema.validate(req.body);

    if (body.error) {
        res.status(400).json({ error: body.error.message });
    }

    const producto = await prisma.producto.create({
        data: {
            ...body.value,
            comercio: {
                connect: {
                    id: id
                }
            }
        },
    });

    res.status(201).json(producto);
});

router.post("/:id", async (req, res) => {
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

router.get("/:id/productos", async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "id invalido" });
    }

    const comercio = await prisma.comercio.findUnique({
        where: {
            id: id
        },
        select: {
            productos: true
        }
    });

    if (!comercio) {
        return res.status(404).json({ error: "Comercio no encontrado" });
    }

    res.status(200).json(comercio.productos);
});
