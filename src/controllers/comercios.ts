import { Router } from "express";
import { Comercio, CategoriaProducto } from "@prisma/client";
import { CategoriaComercio } from "../types";
import comercioSchema from "../schemas/comercio";
import { fromZodError } from "zod-validation-error";
import { prisma } from "../prisma";

const router = Router();

router.post("/", async (req, res) => {
	const body = comercioSchema.safeParse(req.body);

	if (!body.success) {
		const error = fromZodError(body.error);
		return res.status(400).json({ error: error.message });
	}

	const data = body.data;
	const { horarios, ...rest } = data;
	const comercio = await prisma.comercio.create({
		data: {
			...rest,
			categorias: JSON.stringify(data.categorias)
		}
	});

	if (horarios) {
		horarios.forEach(async horario => {
			await prisma.horario.create({
				data: {
					...horario,
					comercio: {
						connect: {
							id: comercio.id
						}
					}
				}
			});
		});
	}

	res.status(201).json(comercio);
});

enum Filtro {
	CategoriaProducto = "cp",
	CategoriaComercio = "cc",
	NombreProducto = "np",
	NombreComercio = "nc"
}

enum Orden {
	Precio = "precio",
	Rating = "rating"
}

router.get("/", async (req, res) => {
	const radKm = Number(req.query.radio) || 30;
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
AS distance FROM Comercio HAVING distance <= ${radKm} AND validado = true ORDER BY distance ASC
    `;

	let comercios: Comercio[] = [];

	const filtro = decodeURI(req.query.filtro as string);
	const ordenar = req.query.ordenar as Orden;
	const filtradoPor = req.query.filtradoPor as Filtro;

	if (filtradoPor === undefined) {
		comercios = [...comerciosCercanos];
	} else if (filtradoPor === Filtro.CategoriaProducto) {
		{
			if (
				!Object.values(CategoriaProducto).includes(
					filtro as CategoriaProducto
				)
			)
				return res
					.status(400)
					.json({ error: "Categoria de producto invalida." });

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
				if (cantProd._count.id > 0) {
					// Checkear
					comercios.push(comercio);
				}
			}
		}
	} else if (filtradoPor === Filtro.CategoriaComercio) {
		if (
			!Object.values(CategoriaComercio).includes(
				filtro as CategoriaComercio
			)
		) {
			return res.status(400).json({
				error: "Categoria de comercio invalida."
			});
		}
		for (const comercio of comerciosCercanos) {
			const categorias: string[] = JSON.parse(
				comercio.categorias as string
			);
			if (categorias.includes(filtro as string)) {
				comercios.push(comercio);
			}
		}
	} else if (filtradoPor === Filtro.NombreProducto) {
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
	} else if (filtradoPor === Filtro.NombreComercio) {
		for (const comercio of comerciosCercanos) {
			if (
				comercio.nombre
					.toLowerCase()
					.includes(filtro.toLowerCase() as string)
			) {
				comercios.push(comercio);
			}
		}
	} else {
		return res.status(400).json({ error: "Filtro invalido." });
	}

	if (ordenar === Orden.Precio) {
		comercios.sort((a, b) => {
			return a.ratingPrecios - b.ratingPrecios;
		});
	} else if (ordenar === Orden.Rating) {
		comercios.sort((a, b) => {
			return a.estrellas - b.estrellas;
		});
	}

	comercios.forEach(comercio => {
		comercio.categorias = JSON.parse(comercio.categorias as string);
		comercio.productosDiabeticos = !!comercio.productosDiabeticos;
		comercio.productosVeganos = !!comercio.productosVeganos;
	});

	res.status(200).json(comercios);
});

router.get("/sinvalidar", async (req, res) => {
	const comercios = await prisma.comercio.findMany({
		where: {
			validado: false
		}
	});

	res.status(200).json(comercios);
});

export default router;
