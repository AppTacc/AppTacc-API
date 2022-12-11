import { z } from "zod";

export default z.object({
	nombre: z.string(),
	descripcion: z.string().optional()
});
