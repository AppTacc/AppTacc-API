import { Request, Response } from "express";
import {
	comercioDELETE,
	comercioGET,
	comercioPATCH,
	comerciosGET,
	comerciosPOST,
	horariosDELETE,
	horariosGET,
	horariosPOST,
	productosPOST,
	validateComercioPOST
} from "../schemas/comercios.schema";
import { prisma } from "../lib/prisma";
import { CategoriaProducto, Comercio } from "@prisma/client";

export const getComercios = async (req: Request, res: Response) => {
	const {
		query: { radio, lat, long, ordenar, filtro, filtradoPor }
	} = comerciosGET.parse(req);

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
AS distance FROM Comercio HAVING distance <= ${radio} AND validado = true ORDER BY distance ASC;
    `;

	let comercios: Comercio[] = [];

	if (filtradoPor === undefined) {
		comercios = [...comerciosCercanos];
	} else if (filtradoPor === "cp") {
		{
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
					comercios.push(comercio);
				}
			}
		}
	} else if (filtradoPor === "cc") {
		comercios = await prisma.comercio.findMany({
			where: {
				categorias: {
					some: {
						id: Number(filtro)
					}
				}
			}
		});
	} else if (filtradoPor === "np") {
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
	} else if (filtradoPor === "nc") {
		for (const comercio of comerciosCercanos) {
			if (
				comercio.nombre
					.toLowerCase()
					.includes((filtro as string).toLowerCase())
			) {
				comercios.push(comercio);
			}
		}
	} else {
		return res.status(400).json({ error: "Filtro invalido." });
	}

	if (ordenar === "precio") {
		comercios.sort((a, b) => {
			return a.ratingPrecios - b.ratingPrecios;
		});
	} else if (ordenar === "rating") {
		comercios.sort((a, b) => {
			return a.estrellas - b.estrellas;
		});
	}

	comercios.forEach(comercio => {
		comercio.productosDiabeticos = !!comercio.productosDiabeticos;
		comercio.productosVeganos = !!comercio.productosVeganos;
	});

	res.status(200).json(comercios);
};

export const getComerciosSinValidar = async (req: Request, res: Response) => {
	const comercios = await prisma.comercio.findMany({
		where: {
			validado: false
		}
	});

	res.status(200).json(comercios);
};

export const getComercio = async (req: Request, res: Response) => {
	const {
		params: { id },
		query: { categorias, horarios, productos }
	} = comercioGET.parse(req);

	const comercio = await prisma.comercio.findUnique({
		where: {
			id
		},
		include: {
			productos,
			categorias,
			horarios
		}
	});

	if (!comercio) {
		return res.status(404).json({ error: "Comercio no encontrado" });
	}

	res.status(200).json(comercio);
};

export const getHorarios = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = horariosGET.parse(req);

	const horarios = await prisma.horario.findMany({
		where: {
			comercioId: id
		}
	});

	res.status(200).json(horarios);
};

export const createHorario = async (req: Request, res: Response) => {
	const {
		params: { id },
		body: horario
	} = horariosPOST.parse(req);

	const comercio = await prisma.comercio.findUnique({
		where: {
			id
		},
		include: {
			horarios: true
		}
	});

	if (!comercio)
		return res.status(404).json({ error: "comercio no encontrado" });

	const superponeAlguno = comercio.horarios.some(h => {
		return (
			h.dia == horario.dia &&
			h.apertura < horario.cierre &&
			h.cierre > horario.apertura
		);
	});

	if (superponeAlguno)
		return res
			.status(400)
			.json({ error: "horario se superpone con otro horario" });

	const horarioCreado = await prisma.horario.create({
		data: {
			...horario,
			comercio: {
				connect: {
					id
				}
			}
		}
	});

	res.status(201).json(horarioCreado);
};

export const deleteHorario = async (req: Request, res: Response) => {
	const {
		params: { id, idHorario }
	} = horariosDELETE.parse(req);

	const horarioEliminado = await prisma.horario.deleteMany({
		where: {
			id: idHorario,
			comercioId: id
		}
	});

	res.status(200).json(horarioEliminado);
};

export const createProducto = async (req: Request, res: Response) => {
	const {
		params: { id },
		body
	} = productosPOST.parse(req);

	const comercio = await prisma.comercio.findUnique({
		where: {
			id: id
		}
	});

	if (!comercio) {
		return res.status(404).json({ error: "Comercio no encontrado" });
	}

	const producto = await prisma.producto.create({
		data: {
			...body,
			comercio: {
				connect: {
					id: id
				}
			}
		}
	});

	res.status(201).json(producto);
};

export const validateComercio = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = validateComercioPOST.parse(req);

	const comercio = await prisma.comercio.update({
		where: {
			id
		},
		data: {
			validado: true
		}
	});
	res.status(200).json(comercio);
};

export const updateComercio = async (req: Request, res: Response) => {
	const {
		params: { id },
		body
	} = comercioPATCH.parse(req);

	const comercio = await prisma.comercio.findUnique({
		where: {
			id
		}
	});

	if (!comercio) {
		return res.status(404).json({ error: "Comercio no encontrado" });
	}

	const comercioActualizado = await prisma.comercio.update({
		where: {
			id
		},
		data: {
			...body,
			categorias: {
				connect: body.categorias
					? body.categorias.map(id => ({ id }))
					: []
			},
			localidad: {
				connect: {
					id: body.localidad || undefined
				}
			}
		}
	});

	return res.status(200).json(comercioActualizado);
};

export const deleteComercio = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = comercioDELETE.parse(req);

	const comercioEliminado = await prisma.comercio.delete({
		where: {
			id
		}
	});

	res.status(202).json(comercioEliminado);
};

export const createComercio = async (req: Request, res: Response) => {
	const { body } = comerciosPOST.parse(req);

	const { horarios, categorias, localidad, ...rest } = body;
	const comercio = await prisma.comercio.create({
		data: {
			...rest,
			localidad: {
				connect: {
					id: localidad
				}
			}
		}
	});

	if (categorias) {
		await prisma.comercio.update({
			where: {
				id: comercio.id
			},
			data: {
				categorias: {
					connect: categorias.map(categoria => ({
						id: categoria
					}))
				}
			}
		});
	}

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
};
