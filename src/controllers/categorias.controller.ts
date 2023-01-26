import { CategoriaProducto } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { categoriasComercioPOST } from "../schemas/categorias.schema";
import { getEnumValues } from "../utils/enums";

export const getCategoriasComercio = async (req: Request, res: Response) => {
	const categoriasComercio = await prisma.categoriaComercio.findMany({});
	return res.status(200).json(categoriasComercio);
};

export const createCategoriaComercio = async (req: Request, res: Response) => {
	const { body } = categoriasComercioPOST.parse(req);

	const categoria = await prisma.categoriaComercio.create({
		data: body
	});
	return res.status(200).json(categoria);
};

export const getCategoriasProducto = async (req: Request, res: Response) => {
	return res.status(200).json(getEnumValues(CategoriaProducto));
};
