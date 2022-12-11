import { CategoriaProducto } from "@prisma/client";
import { z } from "zod";

export default z.object({
	nombre: z.string(),
	descripcion: z.string().optional(),
	precio: z.number(),
	rating: z.number().optional(),
	categoria: z.nativeEnum(CategoriaProducto),
	imagenURL: z.string().optional()
});
