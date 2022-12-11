import { DiaSemana } from "@prisma/client";
import { z } from "zod";

export default z.object({
	dia: z.nativeEnum(DiaSemana),
	apertura: z.number(),
	cierre: z.number()
});
