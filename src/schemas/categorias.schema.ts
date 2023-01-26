import { z } from "zod";

export const categoriasComercioGET = z.object({
	params: z.object({}),
	query: z.object({}),
	body: z.object({})
});

export const categoriasComercioPOST = z.object({
	params: z.object({}),
	query: z.object({}),
	body: z.object({
		nombre: z.string(),
		descripcion: z.string().optional()
	})
});

export const categoriasProductoGET = z.object({
	params: z.object({}),
	query: z.object({}),
	body: z.object({})
});
