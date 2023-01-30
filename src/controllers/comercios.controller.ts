import { Request, Response } from "express";
import {
	comercioCategoriasDELETE,
	comercioCategoriasPOST,
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
import {
	CategoriaComercio,
	CategoriaProducto,
	Comercio,
	Horario,
	Prisma,
	Producto
} from "@prisma/client";
import { logger } from "../utils/logging";
import {
	getBadRequestError,
	getInternalError,
	getNotFoundError
} from "../utils/errors";
import { newRecoveryStack } from "../utils/recoveryStack";

export const getComercios = async (req: Request, res: Response) => {
	const {
		query: { radio, lat, long, ordenar, filtro, filtradoPor }
	} = comerciosGET.parse(req);

	let comerciosCercanos: Comercio[];
	try {
		comerciosCercanos = await prisma.$queryRaw<Comercio[]>`
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
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error recuperando los comercios"
		);
		return res.status(error.status).json({ error });
	}

	let comercios: Comercio[] = [];

	if (filtradoPor === undefined) {
		comercios = [...comerciosCercanos];
	} else if (filtradoPor === "cp") {
		{
			for (const comercio of comerciosCercanos) {
				let cantProd: { _count: { id: number } };
				try {
					cantProd = await prisma.producto.aggregate({
						_count: {
							id: true
						},
						where: {
							comercioId: comercio.id,
							categoria: filtro as CategoriaProducto
						}
					});
				} catch (err: unknown) {
					logger.error(err);
					const error = getInternalError(
						"hubo un error filtrando los comercios"
					);
					return res.status(error.status).json({ error });
				}
				if (cantProd._count.id > 0) {
					comercios.push(comercio);
				}
			}
		}
	} else if (filtradoPor === "cc") {
		try {
			comercios = await prisma.comercio.findMany({
				where: {
					categorias: {
						some: {
							id: Number(filtro)
						}
					}
				}
			});
		} catch (err: unknown) {
			logger.error(err);
			const error = getInternalError(
				"hubo un error filtrando los comercios"
			);
			return res.status(error.status).json({ error });
		}
	} else if (filtradoPor === "np") {
		for (const comercio of comerciosCercanos) {
			let cantProd: { _count: { id: number } };
			try {
				cantProd = await prisma.producto.aggregate({
					_count: {
						id: true
					},
					where: {
						comercioId: comercio.id,
						nombre: filtro as string
					}
				});
			} catch (err: unknown) {
				logger.error(err);
				const error = getInternalError(
					"hubo un error filtrando los comercios"
				);
				return res.status(error.status).json({ error });
			}
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
	let comercios: Comercio[];
	try {
		comercios = await prisma.comercio.findMany({
			where: {
				validado: false
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error recuperando los comercios"
		);
		return res.status(error.status).json({ error });
	}

	res.status(200).json(comercios);
};

export const getComercio = async (req: Request, res: Response) => {
	const {
		params: { id },
		query: { categorias, horarios, productos }
	} = comercioGET.parse(req);

	let comercio:
		| (Comercio & {
				productos: Producto[];
				categorias?: CategoriaComercio[];
				horarios?: Horario[];
		  })
		| null;
	try {
		comercio = await prisma.comercio.findUnique({
			where: {
				id
			},
			include: {
				productos,
				categorias,
				horarios
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error recuperando los comercios"
		);
		return res.status(error.status).json({ error });
	}

	if (!comercio) {
		const error = getNotFoundError("comercio no encontrado");
		return res.status(error.status).json({ error });
	}

	res.status(200).json(comercio);
};

export const getHorarios = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = horariosGET.parse(req);

	let horarios: Horario[];
	try {
		horarios = await prisma.horario.findMany({
			where: {
				comercioId: id
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error recuperando los horarios"
		);
		return res.status(error.status).json({ error });
	}

	res.status(200).json(horarios);
};

export const createHorario = async (req: Request, res: Response) => {
	const {
		params: { id },
		body: horario
	} = horariosPOST.parse(req);

	let comercio: (Comercio & { horarios: Horario[] }) | null;
	try {
		comercio = await prisma.comercio.findUnique({
			where: {
				id
			},
			include: {
				horarios: true
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error recuperando el comercio");
		return res.status(error.status).json({ error });
	}

	if (!comercio) {
		const error = getNotFoundError("comercio no encontrado");
		return res.status(error.status).json({ error });
	}

	const superponeAlguno = comercio.horarios.some(h => {
		return (
			h.dia == horario.dia &&
			h.apertura < horario.cierre &&
			h.cierre > horario.apertura
		);
	});

	if (superponeAlguno) {
		const error = getBadRequestError(
			"el horario se superpone con otro horario"
		);
		return res.status(error.status).json({ error });
	}

	let horarioCreado: Horario;
	try {
		horarioCreado = await prisma.horario.create({
			data: {
				...horario,
				comercio: {
					connect: {
						id
					}
				}
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error creando el horario");
		return res.status(error.status).json({ error });
	}

	res.status(201).json(horarioCreado);
};

export const deleteHorario = async (req: Request, res: Response) => {
	const {
		params: { id, idHorario }
	} = horariosDELETE.parse(req);

	let horarioEliminado: Prisma.BatchPayload;
	try {
		horarioEliminado = await prisma.horario.deleteMany({
			where: {
				id: idHorario,
				comercioId: id
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error eliminando el horario");
		return res.status(error.status).json({ error });
	}

	res.status(200).json(horarioEliminado);
};

export const createProducto = async (req: Request, res: Response) => {
	const {
		params: { id },
		body
	} = productosPOST.parse(req);

	let comercio: Comercio | null;
	try {
		comercio = await prisma.comercio.findUnique({
			where: {
				id: id
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error recuperando el comercio");
		return res.status(error.status).json({ error });
	}

	if (!comercio) {
		const error = getNotFoundError("comercio no encontrado");
		return res.status(error.status).json({ error });
	}

	let producto: Producto;
	try {
		producto = await prisma.producto.create({
			data: {
				...body,
				comercio: {
					connect: {
						id: id
					}
				}
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error creando el producto");
		return res.status(error.status).json({ error });
	}

	res.status(201).json(producto);
};

export const validateComercio = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = validateComercioPOST.parse(req);

	let comercio: Comercio;
	try {
		comercio = await prisma.comercio.update({
			where: {
				id
			},
			data: {
				validado: true
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error verificando el comercio");
		return res.status(error.status).json({ error });
	}

	res.status(200).json(comercio);
};

export const updateComercio = async (req: Request, res: Response) => {
	const {
		params: { id },
		body
	} = comercioPATCH.parse(req);

	let comercio: Comercio | null;
	try {
		comercio = await prisma.comercio.findUnique({
			where: {
				id
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error recuperando el comercio");
		return res.status(error.status).json({ error });
	}

	if (!comercio) {
		const error = getNotFoundError("comercio no encontrado");
		return res.status(error.status).json({ error });
	}

	let comercioActualizado: Comercio;
	try {
		comercioActualizado = await prisma.comercio.update({
			where: {
				id
			},
			data: {
				...body,
				localidad: {
					connect: {
						id: body.localidad || undefined
					}
				}
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error actualizando el comercio"
		);
		return res.status(error.status).json({ error });
	}

	return res.status(200).json(comercioActualizado);
};

export const addCategorias = async (req: Request, res: Response) => {
	const {
		params: { id },
		body
	} = comercioCategoriasPOST.parse(req);

	let comercio: Comercio | null;
	try {
		comercio = await prisma.comercio.findUnique({
			where: {
				id
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error agregando las categorias"
		);
		return res.status(error.status).json({ error });
	}

	if (!comercio) {
		const error = getNotFoundError("comercio no encontrado");
		return res.status(error.status).json({ error });
	}

	try {
		await prisma.comercio.update({
			where: {
				id
			},
			data: {
				categorias: {
					connect: body.categorias.map(idCategoria => ({
						id: idCategoria
					}))
				}
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error agregando las categorias"
		);
		return res.status(error.status).json({ error });
	}

	return res.status(200).end();
};

export const deleteCategoria = async (req: Request, res: Response) => {
	const {
		params: { id },
		body
	} = comercioCategoriasDELETE.parse(req);

	let comercio: Comercio | null;
	try {
		comercio = await prisma.comercio.findUnique({
			where: {
				id
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error agregando las categorias"
		);
		return res.status(error.status).json({ error });
	}

	if (!comercio) {
		const error = getNotFoundError("comercio no encontrado");
		return res.status(error.status).json({ error });
	}

	try {
		await prisma.comercio.update({
			where: { id },
			data: {
				categorias: {
					disconnect: { id: body.categoria }
				}
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error eliminando la categoria");
		return res.status(error.status).json({ error });
	}

	return res.status(200).end();
};

export const deleteComercio = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = comercioDELETE.parse(req);

	let comercioEliminado: Comercio;
	try {
		comercioEliminado = await prisma.comercio.delete({
			where: {
				id
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error eliminando el comercio");
		return res.status(error.status).json({ error });
	}

	res.status(202).json(comercioEliminado);
};

export const createComercio = async (req: Request, res: Response) => {
	const { body } = comerciosPOST.parse(req);

	const { horarios, categorias, localidad, ...rest } = body;

	const recoveryStack = newRecoveryStack();

	let comercio: Comercio;
	try {
		comercio = await prisma.comercio.create({
			data: {
				...rest,
				localidad: {
					connect: {
						id: localidad
					}
				}
			}
		});
		recoveryStack.addFn(() =>
			prisma.comercio.delete({
				where: {
					id: comercio.id
				}
			})
		);
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error creando el comercio");
		return res.status(error.status).json({ error });
	}

	if (categorias) {
		try {
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
		} catch (err: unknown) {
			recoveryStack.runFns();
			logger.error(err);
			const error = getInternalError(
				"hubo un error asignando las categorias del comercio"
			);
			return res.status(error.status).json({ error });
		}
	}

	if (horarios) {
		try {
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
		} catch (err: unknown) {
			recoveryStack.runFns();
			logger.error(err);
			const error = getInternalError(
				"hubo un error creando los horarios del comercio"
			);
			return res.status(error.status).json({ error });
		}
	}

	res.status(201).json(comercio);
};
