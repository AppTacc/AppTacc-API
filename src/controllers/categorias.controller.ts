import { CategoriaComercio, CategoriaProducto } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { categoriasComercioPOST } from "../schemas/categorias.schema";
import { getEnumValues } from "../utils/enums";
import { getInternalError } from "../utils/errors";
import { logger } from "../utils/logging";

export const getCategoriasComercio = async (req: Request, res: Response) => {
	const categoriasComercio = await prisma.categoriaComercio.findMany({});
	return res.status(200).json(categoriasComercio);
};

export const createCategoriaComercio = async (req: Request, res: Response) => {
	const { body } = categoriasComercioPOST.parse(req);

	let categoria: CategoriaComercio;
	try {
		categoria = await prisma.categoriaComercio.create({
			data: body
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error creando la categoría");
		return res.status(error.status).json({ error });
	}
	return res.status(200).json(categoria);
};

export const getCategoriasProducto = async (req: Request, res: Response) => {
	return res.status(200).json(getEnumValues(CategoriaProducto));
};
