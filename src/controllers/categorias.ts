import { CategoriaProducto } from "@prisma/client";
import { Router } from "express";
import { CategoriaComercio } from "../types";
import { getEnumValues } from "../util";

const router = Router();

router.get("/comercio", (req, res) => {
	res.status(200).json(getEnumValues(CategoriaComercio));
});

router.get("/producto", (req, res) => {
	res.status(200).json(getEnumValues(CategoriaProducto));
});

export default router;
