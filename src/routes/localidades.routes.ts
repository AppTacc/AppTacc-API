import { Router } from "express";
import {
	createLocalidad,
	getLocalidad,
	getLocalidades
} from "../controllers/localidades.controller";
import {
	localidadesGET,
	localidadesPOST,
	localidadGET
} from "../schemas/localidades.schema";
import { validate } from "../utils/validation";

const localidadesRoutes = Router();

localidadesRoutes.get("/", validate(localidadesGET), getLocalidades);
localidadesRoutes.get("/:id", validate(localidadGET), getLocalidad);
localidadesRoutes.post("/", validate(localidadesPOST), createLocalidad);

export default localidadesRoutes;
