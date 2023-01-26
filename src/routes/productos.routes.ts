import { Router } from "express";
import {
	deleteProducto,
	getProductosSinValidar,
	updateProducto,
	validateProducto
} from "../controllers/productos.controller";
import {
	productoDELETE,
	productoPATCH,
	productosSinValidarGET,
	validateProductoPOST
} from "../schemas/productos.schema";
import { validate } from "../utils/validation";

const productosRoutes = Router();

productosRoutes.post(
	"/:id/validar",
	validate(validateProductoPOST),
	validateProducto
);

productosRoutes.get(
	"/sinvalidar",
	validate(productosSinValidarGET),
	getProductosSinValidar
);

productosRoutes.delete("/:id", validate(productoDELETE), deleteProducto);

productosRoutes.patch("/:id", validate(productoPATCH), updateProducto);

export default productosRoutes;
