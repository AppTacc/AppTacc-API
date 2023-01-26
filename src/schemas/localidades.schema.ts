import { z } from "zod";

export const localidadesGET = z.object({
	params: z.object({}),
	query: z.object({}),
	body: z.object({})
});

export const localidadGET = z.object({
	params: z.object({
		id: z.coerce.number()
	}),
	query: z.object({}),
	body: z.object({})
});

export const localidadesPOST = z.object({
	params: z.object({}),
	query: z.object({}),
	body: z.object({
		nombre: z.string(),
		latitud: z.number(),
		longitud: z.number()
	})
});
