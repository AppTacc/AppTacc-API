import { CategoriaProducto } from "@prisma/client";
import { z } from "zod";

export const validateProductoPOST = z.object({
	params: z.object({
		id: z.coerce.number()
	}),
	body: z.object({}),
	query: z.object({})
});

export const productosSinValidarGET = z.object({
	params: z.object({}),
	body: z.object({}),
	query: z.object({})
});

export const productoDELETE = z.object({
	params: z.object({
		id: z.coerce.number()
	}),
	body: z.object({}),
	query: z.object({})
});

export const productoPATCH = z.object({
	body: z.object({
		nombre: z.string(),
		descripcion: z.string().optional(),
		precio: z.number(),
		rating: z.number().optional(),
		categoria: z.nativeEnum(CategoriaProducto),
		imagenURL: z.string().optional()
	}),
	params: z.object({
		id: z.coerce.number()
	}),
	query: z.object({})
});
