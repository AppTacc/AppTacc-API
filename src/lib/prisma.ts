import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
	if (params.action === "findUnique" || params.action === "findFirst") {
		params.action = "findFirst";
		params.args.where["deletedOn"] = null;
	}

	if (params.action === "findMany") {
		if (params.args.where) {
			if (params.args.where.deletedOn === undefined) {
				params.args.where["deletedOn"] = null;
			}
		} else {
			params.args["where"] = { deletedOn: null };
		}
	}

	return next(params);
});

// Previene que se actualicen registros con "deletedOn" !== null.
// Prisma no soporta por el momento hacer "connect" en updateMany.
// Este middleware convierte todos los "update" en "updateMany".
// Esto se hace porque "update" no permite filtrar por "deletedOn" !== null.
// El problema es que esto evita que podamos hacer "update" y "connect".
// Mientras prisma no lo soporte, lo comento.

// prisma.$use(async (params, next) => {
// 	if (params.action === "update") {
// 		params.action = "updateMany";

// 		params.args.where["deletedOn"] = null;
// 	}

// 	if (params.action === "updateMany") {
// 		if (params.args.where !== undefined) {
// 			params.args.where["deletedOn"] = null;
// 		} else {
// 			params.args["where"] = { deletedOn: null };
// 		}
// 	}

// 	return next(params);
// });

prisma.$use(async (params, next) => {
	if (params.action === "delete") {
		params.action = "update";
		params.args["data"] = { deletedOn: new Date() };
	}

	if (params.action === "deleteMany") {
		params.action = "updateMany";

		if (params.args.data !== undefined) {
			params.args.data["deletedOn"] = new Date();
		} else {
			params.args["data"] = { deletedOn: new Date() };
		}
	}

	return next(params);
});
