import { z } from "zod";
import { DiaSemana, Localidad } from "@prisma/client";
import { CategoriaComercio } from "../types";

export default z.object({
	nombre: z.string(),
	categorias: z.array(z.nativeEnum(CategoriaComercio)),
	direccion: z.string(),
	localidad: z.nativeEnum(Localidad),
	latitud: z.number(),
	longitud: z.number(),
	horario: z.string(),
	horarios: z
		.array(
			z.object({
				dia: z.nativeEnum(DiaSemana),
				apertura: z.number(),
				cierre: z.number()
			})
		)
		.optional(),
	facebookURL: z.string().optional(),
	URL: z.string().optional(),
	instagramURL: z.string().optional(),
	productosDiabeticos: z.boolean().optional(),
	productosVeganos: z.boolean().optional(),
	ratingPrecios: z.number().optional(),
	estrellas: z.number().optional(),
	telefono: z.string(),
	imagenURL: z.string().optional()
});
