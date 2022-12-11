import { PrismaClientValidationError } from "@prisma/client/runtime";
import { Router } from "express";
import { fromZodError } from "zod-validation-error";
import { prisma } from "../prisma";
import { CategoriaComercio } from "../types";
import productoSchema from "../schemas/producto";
import horarioSchema from "../schemas/horario";

const router = Router();

router.get("/:id", async (req, res) => {
	const id = Number(req.params.id);

	if (isNaN(id)) {
		return res.status(400).json({ error: "id invalido" });
	}

	const productos = req.query.productos === "true";
	// const categorias = Boolean(req.query.categorias as string);
	const horarios = req.query.horarios === "true";

	const comercio = await prisma.comercio.findUnique({
		where: {
			id
		},
		include: {
			productos,
			// categorias,
			horarios
		}
	});

	if (!comercio) {
		return res.status(404).json({ error: "Comercio no encontrado" });
	}

	comercio.categorias = JSON.parse(comercio.categorias as string);

	res.status(200).json(comercio);
});

router.post("/:id/horarios", async (req, res) => {
	const idComercio = Number(req.params.id as string);

	if (isNaN(idComercio))
		return res.status(400).json({ error: "id invalido" });

	const body = horarioSchema.safeParse(req.body);

	if (!body.success) {
		const error = fromZodError(body.error);
		return res.status(400).json({ error: error.message });
	}

	const horario = body.data;

	const comercio = await prisma.comercio.findUnique({
		where: {
			id: idComercio
		},
		include: {
			horarios: true
		}
	});

	if (!comercio)
		return res.status(404).json({ error: "comercio no encontrado" });

	const superponeAlguno = comercio.horarios.some(h => {
		return (
			h.dia == horario.dia &&
			h.apertura < horario.cierre &&
			h.cierre > horario.apertura
		);
	});

	if (superponeAlguno)
		return res
			.status(400)
			.json({ error: "horario se superpone con otro horario" });

	const horarioCreado = await prisma.horario.create({
		data: {
			...horario,
			comercio: {
				connect: {
					id: idComercio
				}
			}
		}
	});

	res.status(201).json(horarioCreado);
});

router.delete("/:id/horarios/:idHorario", async (req, res) => {
	const idComercio = Number(req.params.id as string);
	const idHorario = Number(req.params.idHorario as string);
	if (isNaN(idComercio) || isNaN(idHorario))
		return res.status(400).json({ error: "id invalido" });

	const horario = await prisma.horario.findUnique({
		where: {
			id: idHorario
		},
		include: {
			comercio: true
		}
	});

	if (!horario)
		return res.status(404).json({ error: "horario no encontrado" });

	const horarioEliminado = await prisma.horario.delete({
		where: {
			id: idHorario
		}
	});

	res.status(200).json(horarioEliminado);
});

router.post("/:id/validar", async (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ error: "id invalido" });
	const comercio = await prisma.comercio.update({
		where: {
			id
		},
		data: {
			validado: true
		}
	});
	res.status(200).json(comercio);
});

router.post("/:id/productos", async (req, res) => {
	const id = Number(req.params.id);

	if (isNaN(id)) {
		return res.status(400).json({ error: "id invalido" });
	}

	const comercio = await prisma.comercio.findUnique({
		where: {
			id: id
		}
	});

	if (!comercio) {
		return res.status(404).json({ error: "Comercio no encontrado" });
	}

	const body = productoSchema.safeParse(req.body);

	if (!body.success) {
		const error = fromZodError(body.error);
		return res.status(400).json({ error: error.message });
	}

	const data = body.data;

	const producto = await prisma.producto.create({
		data: {
			...data,
			comercio: {
				connect: {
					id: id
				}
			}
		}
	});

	res.status(201).json(producto);
});

router.patch("/:id", async (req, res) => {
	const id = Number(req.params.id);

	if (isNaN(id)) {
		return res.status(400).json({ error: "id invalido" });
	}

	const comercio = await prisma.comercio.findUnique({
		where: {
			id
		}
	});

	if (!comercio) {
		return res.status(404).json({ error: "Comercio no encontrado" });
	}

	const nuevaCategoria = req.body.categorias as CategoriaComercio;

	if (nuevaCategoria) {
		if (!Object.values(CategoriaComercio).includes(nuevaCategoria)) {
			return res.status(400).json({ error: "Categoria invalida" });
		}
		const categorias = JSON.parse(comercio.categorias as string);
		categorias.push(nuevaCategoria);
		req.body.categorias = JSON.stringify(categorias);
	}

	try {
		const comercioActualizado = await prisma.comercio.update({
			where: {
				id
			},
			data: req.body
		});

		return res.status(200).json(comercioActualizado);
	} catch (err) {
		if (err instanceof PrismaClientValidationError) {
			return res.status(400).json({
				error: "Error en la validacion de los datos"
			});
		}
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

router.delete("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) {
		return res.status(400).json({ error: "id invalido" });
	}

	const comercioEliminado = await prisma.comercio.delete({
		where: {
			id
		}
	});

	res.status(202).json(comercioEliminado);
});

export default router;
