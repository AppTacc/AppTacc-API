import { z } from "zod";
import { DiaSemana } from "@prisma/client";

export default z.object({
	nombre: z.string(),
	direccion: z.string(),
	categorias: z.array(z.number()),
	localidad: z.number(),
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
