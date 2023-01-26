import { CategoriaProducto, DiaSemana } from "@prisma/client";
import { z } from "zod";

const FiltradoPor = z.union([
	z.literal("cp"),
	z.literal("cc"),
	z.literal("np"),
	z.literal("nc")
]);

const Orden = z.union([z.literal("precio"), z.literal("rating")]);

export const comerciosGET = z.object({
	body: z.object({}),
	params: z.object({}),
	query: z.object({
		lat: z.coerce.number(),
		long: z.coerce.number(),
		radio: z.coerce.number().default(30),
		filtro: z.string().optional(),
		filtradoPor: FiltradoPor.optional(),
		ordenar: Orden.optional()
	})
});

export const comerciosSinValidarGET = z.object({
	body: z.object({}),
	query: z.object({}),
	params: z.object({})
});

export const comercioGET = z.object({
	body: z.object({}),
	query: z.object({
		productos: z.coerce.boolean(),
		categorias: z.coerce.boolean(),
		horarios: z.coerce.boolean()
	}),
	params: z.object({
		id: z.coerce.number()
	})
});

export const comercioPATCH = z.object({
	query: z.object({}),
	params: z.object({
		id: z.coerce.number()
	}),
	body: z.object({
		nombre: z.string().optional(),
		direccion: z.string().optional(),
		latitud: z.number().optional(),
		longitud: z.number().optional(),
		localidad: z.number().optional(),
		categorias: z.array(z.number()).optional(),
		horario: z.string().optional(),
		facebookURL: z.string().optional(),
		URL: z.string().optional(),
		instagramURL: z.string().optional(),
		productosDiabeticos: z.boolean().optional(),
		productosVeganos: z.boolean().optional(),
		ratingPrecios: z.number().optional(),
		estrellas: z.number().optional(),
		telefono: z.string().optional(),
		imagenURL: z.string().optional()
	})
});

export const comercioDELETE = z.object({
	query: z.object({}),
	params: z.object({
		id: z.coerce.number()
	}),
	body: z.object({})
});

export const horariosGET = z.object({
	body: z.object({}),
	query: z.object({}),
	params: z.object({
		id: z.coerce.number()
	})
});

export const horariosPOST = z.object({
	body: z.object({
		dia: z.nativeEnum(DiaSemana),
		apertura: z.number(),
		cierre: z.number()
	}),
	query: z.object({}),
	params: z.object({
		id: z.coerce.number()
	})
});

export const horariosDELETE = z.object({
	body: z.object({}),
	query: z.object({}),
	params: z.object({
		id: z.coerce.number(),
		idHorario: z.coerce.number()
	})
});

export const validateComercioPOST = z.object({
	body: z.object({}),
	query: z.object({}),
	params: z.object({
		id: z.coerce.number()
	})
});

export const productosPOST = z.object({
	body: z.object({
		nombre: z.string(),
		descripcion: z.string().optional(),
		precio: z.number(),
		rating: z.number().optional(),
		categoria: z.nativeEnum(CategoriaProducto),
		imagenURL: z.string().optional()
	}),
	query: z.object({}),
	params: z.object({
		id: z.coerce.number()
	})
});

export const comerciosPOST = z.object({
	body: z.object({
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
	}),
	query: z.object({}),
	params: z.object({})
});
