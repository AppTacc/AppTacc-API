import { Localidad } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { localidadesPOST, localidadGET } from "../schemas/localidades.schema";
import { getInternalError, getNotFoundError } from "../utils/errors";
import { logger } from "../utils/logging";

export const getLocalidades = async (req: Request, res: Response) => {
	let localidades: Localidad[];

	try {
		localidades = await prisma.localidad.findMany();
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error recuperando las localidades"
		);
		return res.status(error.status).json({ error });
	}

	return res.status(200).json(localidades);
};

export const getLocalidad = async (req: Request, res: Response) => {
	const {
		params: { id }
	} = localidadGET.parse(req);

	let localidad: Localidad | null;
	try {
		localidad = await prisma.localidad.findUnique({
			where: {
				id
			}
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError(
			"hubo un error recuperando la localidad"
		);
		return res.status(error.status).json({ error });
	}

	if (!localidad) {
		const error = getNotFoundError("localidad no encontrada");
		return res.status(error.status).json({ error });
	}

	return res.status(200).json(localidad);
};

export const createLocalidad = async (req: Request, res: Response) => {
	const { body } = localidadesPOST.parse(req);

	let localidad: Localidad;
	try {
		localidad = await prisma.localidad.create({
			data: body
		});
	} catch (err: unknown) {
		logger.error(err);
		const error = getInternalError("hubo un error creando la localidad");
		return res.status(error.status).json({ error });
	}

	return res.status(201).json(localidad);
};
