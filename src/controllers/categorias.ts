import { CategoriaProducto } from "@prisma/client";
import { Router } from "express";
import { CategoriaComercio } from "../types";
import { getEnumValues } from "../util";
import categoriaComercioSchema from "../schemas/categoriaComercio";
import { prisma } from "../prisma";
import { fromZodError } from "zod-validation-error";

const router = Router();

router.get("/comercio", (req, res) => {
	res.status(200).json(getEnumValues(CategoriaComercio));
});

router.post("/comercio", async (req, res) => {
	const body = categoriaComercioSchema.safeParse(req.body);
	if (!body.success) {
		const error = fromZodError(body.error);
		return res.status(400).json({ error: error.message });
	}
	const data = body.data;
	const categoria = await prisma.categoriaComercio.create({
		data
	});
	return res.status(200).json(categoria);
});

router.get("/producto", (req, res) => {
	res.status(200).json(getEnumValues(CategoriaProducto));
});

export default router;
