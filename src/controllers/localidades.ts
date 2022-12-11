import { Router } from "express";
import { fromZodError } from "zod-validation-error";
import { prisma } from "../prisma";
import localidadSchema from "../schemas/localidad";

const router = Router();

router.get("/", async (req, res) => {
	const localidades = await prisma.localidad.findMany();
	return res.status(200).json(localidades);
});

router.post("/", async (req, res) => {
	const body = localidadSchema.safeParse(req.body);
	if (!body.success) {
		const error = fromZodError(body.error);
		return res.status(400).json({ error: error.message });
	}
	const data = body.data;
	const localidad = await prisma.localidad.create({
		data
	});
	return res.status(201).json(localidad);
});

export default router;
