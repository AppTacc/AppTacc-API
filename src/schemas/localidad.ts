import { z } from "zod";

export default z.object({
	nombre: z.string(),
	latitud: z.number(),
	longitud: z.number()
});
