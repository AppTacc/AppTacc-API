import { Router } from "express";
import joi from "joi";
import { PrismaClient, Localidad, Comercio, CategoriaProducto } from "@prisma/client";
import { getEnumValues } from "../util";
import { CategoriaComercio } from "../types";

const prisma = new PrismaClient({
    log: process.env.NODE_ENV == "DEVELOPMENT" ? ["query"] : []
});

const comercioSchema = joi.object({
    nombre: joi.string().required(),
    categorias: joi.array().items(joi.valid(...getEnumValues(CategoriaComercio)).required()),
    direccion: joi.string().required(),
    localidad: joi.valid(...getEnumValues(Localidad)).required(),
    latitud: joi.number().required(),
    longitud: joi.number().required(),
    horario: joi.string().required(),
    facebookURL: joi.string().allow(null, ''),
    URL: joi.string().allow(null, ''),
    instagramURL: joi.string().allow(null, ''),
    productosDiabeticos: joi.boolean(),
    productosVeganos: joi.boolean(),
    ratingPrecios: joi.number(),
    estrellas: joi.number(),
    telefono: joi.string().required(),
    imagenURL: joi.string().allow(null, '')
});

const router = Router();

router.post("/", async (req, res) => {
    const body = comercioSchema.validate(req.body);
    if (body.error) {
        res.status(400).json({ error: body.error });
    } else {
        const comercio = await prisma.comercio.create({
            data: { ...body.value, categorias: JSON.stringify(body.value.categorias) }
        });
        res.status(201).json(comercio);
    }
});

router.get("/", async (req, res) => {
    const radKm = 20;
    const lat = Number(req.query.lat);
    const long = Number(req.query.long);
    if (isNaN(lat) || isNaN(long))
        return res.status(400).json({ error: "Latitud o longitud invalidos." });

    const comerciosCercanos = await prisma.$queryRaw<Comercio[]>`
        SELECT *, 
( 6371 * 
    ACOS( 
        COS( RADIANS( latitud ) ) * 
        COS( RADIANS( ${lat} ) ) * 
        COS( RADIANS( ${long} ) - 
        RADIANS( longitud ) ) + 
        SIN( RADIANS( latitud ) ) * 
        SIN( RADIANS( ${lat}) ) 
    ) 
) 
AS distance FROM Comercio HAVING distance <= ${radKm} ORDER BY distance ASC
    `;

    let comercios: Comercio[] = [];

    const { filtradoPor, filtro, ordenar } = req.query;

    if (filtradoPor === undefined) {
        comercios = [...comerciosCercanos];
    } else if (filtradoPor === "cp") {
        if (Object.values(CategoriaProducto).includes(filtro as CategoriaProducto)) { // TODO: Checkear
            for (const comercio of comerciosCercanos) {
                const cantProd = await prisma.producto.aggregate({
                    _count: {
                        id: true
                    },
                    where: {
                        comercioId: comercio.id,
                        categoria: filtro as CategoriaProducto
                    }
                });
                if (cantProd._count.id > 0) { // Checkear
                    comercios.push(comercio);
                }
            }
        }
    } else if (filtradoPor == "cc") {
        for (const comercio of comerciosCercanos) {
            const categorias: string[] = JSON.parse(comercio.categorias);
            if (categorias.includes(filtro as string)) {
                comercios.push(comercio);
            }
        }

    } else if (filtradoPor == "np") {
        for (const comercio of comerciosCercanos) {
            const cantProd = await prisma.producto.aggregate({
                _count: {
                    id: true
                },
                where: {
                    comercioId: comercio.id,
                    nombre: filtro as string
                }
            });
            if (cantProd._count.id > 0) {
                comercios.push(comercio);
            }
        }
    } else if (filtradoPor == "nc") {
        for (const comercio of comercios) {
            if (comercio.nombre === filtro) {
                comercios.push(comercio);
            }
        }
    } else {
        return res.status(400).json({ error: "Filtro invalido." });
    }

    if (ordenar == "precio") {
        comercios.sort((a, b) => {
            return a.ratingPrecios - b.ratingPrecios;
        })
    } else if (ordenar == "rating") {
        comercios.sort((a, b) => {
            return a.estrellas - b.estrellas;
        })
    }

    res.status(200).json(comercios);
});

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const comercio = await prisma.comercio.findUnique({
        where: {
            id
        }
    });

    res.status(200).json(comercio);
});

export default router;