import { Router } from "express";
import {
	createCategoriaComercio,
	getCategoriasComercio,
	getCategoriasProducto
} from "../controllers/categorias.controller";
import {
	categoriasComercioGET,
	categoriasComercioPOST,
	categoriasProductoGET
} from "../schemas/categorias.schema";
import { validate } from "../utils/validation";

const categoriasRoutes = Router();

categoriasRoutes.get(
	"/comercio",
	validate(categoriasComercioGET),
	getCategoriasComercio
);
categoriasRoutes.get(
	"/producto",
	validate(categoriasProductoGET),
	getCategoriasProducto
);
categoriasRoutes.post(
	"/comercio",
	validate(categoriasComercioPOST),
	createCategoriaComercio
);

export default categoriasRoutes;
