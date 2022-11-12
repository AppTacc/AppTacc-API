import { CategoriaProducto, Comercio } from "@prisma/client";
import { Router } from "express";
import { getEnumValues } from "../util";

const router = Router();

router.get("/comercio", (req, res) => {
    const comercio = {
        nombre: "Sol de Invierno",
        categorias: ["Para llevar"],
        direccion: "25 de Mayo 3891",
        latitud: -37.99046981482626,
        longitud: -57.558342038624005,
        horario: "9:30 - 20:30",
        facebookURL: "https://www.facebook.com/soldeinviernosingluten/",
        instagramURL: "",
        twitterURL: "",
        productos: [],
        estrellas: 5,
        ratingPrecios: 3,
        productosDiabeticos: true,
        productosVegetarianos: true,
    };
    res.status(200).json(comercio);
});

router.get("/categorias/comercio", (req, res) => {
    res.status(200).json([
        "Restaurante",
        "Bar",
        "Cafe",
        "Takeaway"]);
});

router.get("/categorias/producto", (req, res) => {
    res.status(200).json([...Object.values(getEnumValues(CategoriaProducto))]);
});

export default router;