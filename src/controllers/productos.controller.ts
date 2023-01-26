import { Comercio, Producto } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
	productoDELETE,
	productoPATCH,
	validateProductoPOST
} from "../schemas/productos.schema";
import { getInternalError, getNotFoundError } from "../utils/errors";
import { logger } from "../utils/logging";

export const validateProducto = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = validateProductoPOST.parse(req);

	let producto: Producto;
	try {
		producto = await prisma.producto.update({
			where: {
				id
			},
			data: {
				validado: true
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error validando el producto");
		return res.status(error.status).json({ error });
	}

	res.status(200).json(producto);
};

export const getProductosSinValidar = async (req: Request, res: Response) => {
	let comercios: (Comercio & { productos: Producto[] })[];
	try {
		comercios = await prisma.comercio.findMany({
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
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error recuperando los productos sin validar"
		);
		return res.status(error.status).json({ error });
	}

	res.status(200).json(
		comercios.filter(
			comercio => comercio.productos && comercio.productos.length > 0
		)
	);
};

export const deleteProducto = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = productoDELETE.parse(req);

	let productoEliminado: Producto;
	try {
		productoEliminado = await prisma.producto.delete({
			where: {
				id
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error eliminando el producto");
		return res.status(error.status).json({ error });
	}

	res.status(202).json(productoEliminado);
};

export const updateProducto = async (req: Request, res: Response) => {
	const {
		params: { id },
		body
	} = productoPATCH.parse(req);

	let producto: Producto | null;

	try {
		producto = await prisma.producto.findUnique({
			where: {
				id
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error recuperando el producto");
		return res.status(error.status).json({ error });
	}

	if (!producto) {
		const error = getNotFoundError("producto no encontrado");
		return res.status(error.status).json({ error });
	}

	let productoNew: Producto;
	try {
		productoNew = await prisma.producto.update({
			where: {
				id
			},
			data: body
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error actualizando el producto"
		);
		return res.status(error.status).json({ error });
	}

	return res.status(200).json(productoNew);
};
