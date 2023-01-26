import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { localidadesPOST, localidadGET } from "../schemas/localidades.schema";

export const getLocalidades = async (req: Request, res: Response) => {
	const localidades = await prisma.localidad.findMany();
	return res.status(200).json(localidades);
};

export const getLocalidad = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = localidadGET.parse(req);

	const localidad = await prisma.localidad.findUnique({
		where: {
			id
		}
	});

	return res.status(200).json(localidad);
};

export const createLocalidad = async (req: Request, res: Response) => {
	const { body } = localidadesPOST.parse(req);

	const localidad = await prisma.localidad.create({
		data: body
	});
	return res.status(201).json(localidad);
};
