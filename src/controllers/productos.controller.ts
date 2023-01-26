import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
	productoDELETE,
	productoPATCH,
	validateProductoPOST
} from "../schemas/productos.schema";

export const validateProducto = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = validateProductoPOST.parse(req);

	const producto = await prisma.producto.update({
		where: {
			id
		},
		data: {
			validado: true
		}
	});

	res.status(200).json(producto);
};

export const getProductosSinValidar = async (req: Request, res: Response) => {
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

	const productoEliminado = await prisma.producto.delete({
		where: {
			id
		}
	});

	res.status(202).json(productoEliminado);
};

export const updateProducto = async (req: Request, res: Response) => {
	const {
		params: { id },
		body
	} = productoPATCH.parse(req);

	const producto = await prisma.producto.findUnique({
		where: {
			id
		}
	});

	if (!producto) {
		return res.status(404).json({ error: "Producto no encontrado" });
	}

	const productoNew = await prisma.producto.update({
		where: {
			id
		},
		data: body
	});

	return res.status(200).json(productoNew);
};
