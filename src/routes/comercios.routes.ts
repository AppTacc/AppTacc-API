import { Router } from "express";
import {
	createComercio,
	createHorario,
	createProducto,
	deleteComercio,
	deleteHorario,
	getComercio,
	getComercios,
	getComerciosSinValidar,
	getHorarios,
	updateComercio,
	validateComercio
} from "../controllers/comercios.controller";
import {
	comercioDELETE,
	comercioGET,
	comercioPATCH,
	comerciosGET,
	comerciosPOST,
	comerciosSinValidarGET,
	horariosDELETE,
	horariosGET,
	horariosPOST,
	productosPOST,
	validateComercioPOST
} from "../schemas/comercios.schema";
import { validate } from "../utils/validation";

const comerciosRoutes = Router();

comerciosRoutes.get("/", validate(comerciosGET), getComercios);
comerciosRoutes.get(
	"/sinvalidar",
	validate(comerciosSinValidarGET),
	getComerciosSinValidar
);

comerciosRoutes.get("/:id", validate(comercioGET), getComercio);

comerciosRoutes.get("/:id/horarios", validate(horariosGET), getHorarios);
comerciosRoutes.post("/:id/horarios", validate(horariosPOST), createHorario);
comerciosRoutes.delete(
	"/:id/horarios/:idHorario",
	validate(horariosDELETE),
	deleteHorario
);

comerciosRoutes.post(
	"/:id/validar",
	validate(validateComercioPOST),
	validateComercio
);

comerciosRoutes.delete("/:id", validate(comercioDELETE), deleteComercio);
comerciosRoutes.patch("/:id", validate(comercioPATCH), updateComercio);

comerciosRoutes.post("/:id/productos", validate(productosPOST), createProducto);

comerciosRoutes.post("/", validate(comerciosPOST), createComercio);

export default comerciosRoutes;
