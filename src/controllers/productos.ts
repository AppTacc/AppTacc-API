import router from "./comercio";

const productoSchema = joi.object({
    nombre: joi.string().required(),
    descripcion: joi.string().required(),
    precio: joi.number().required(),
    categoria: joi.valid(...getEnumValues(CategoriaProducto)).required(),
    rating: joi.number(),
    imagen: joi.string()
});

router.post("/:id/productos", async (req, res) => {
    const id = Number(req.params.id);

    if(isNaN(id)) {
        return res.status(400).json({ error: "id invalido" });
    }

    const comercio = await prisma.comercio.findUnique({
        where: {
            id: id
        }

    });

    if(!comercio) {
        return res.status(404).json({ error: "Comercio no encontrado" });
    }

    const body = productoSchema.validate(req.body);

    if(body.error) {
        res.status(400).json({ error: body.error.message });
    }

    const producto = await prisma.producto.create({
        data: {
            ...body.value,
            comercio: {
                connect: {
                    id: id
                }
            }
        },
    });

    res.status(201).json(producto);
});