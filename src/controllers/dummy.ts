import { CategoriaProducto, Comercio } from "@prisma/client";
import { Router } from "express";
import { getEnumValues } from "../util";

const router = Router();

router.get("/comercio", (req, res) => {
    const comercio = {
        nombre: "Sol de Invierno",
        categorias: ["ParaLlevar"],
        direccion: "25 de Mayo 3891",
        localidad: "MarDelPlata",
        latitud: -37.99046981482626,
        longitud: -57.558342038624005,
        horario: "9:30 - 20:30",
        facebookURL: "https://www.facebook.com/soldeinviernosingluten/",
        instagramURL: "",
        URL: "",
        imagenURL: "https://scontent.fmdq1-1.fna.fbcdn.net/v/t1.18169-9/14666270_1334353563242234_3263649987011451089_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=PoUpuH2P-AkAX8jjEYB&_nc_ht=scontent.fmdq1-1.fna&oh=00_AfCDQZ-PrSPeo4QpY83Cn2qGnMMxNXVJWJDVmlwqGdW-Mg&oe=63965E90",
        productos: [],
        estrellas: 5,
        ratingPrecios: 3,
        productosDiabeticos: true,
        productosVeganos: true,
    };
    res.status(200).json(comercio);
});

router.get("/comercios", (req, res) => {
    const comercio = {
        nombre: "Sol de Invierno",
        categorias: ["ParaLlevar"],
        direccion: "25 de Mayo 3891",
        localidad: "MarDelPlata",
        latitud: -37.99046981482626,
        longitud: -57.558342038624005,
        horario: "9:30 - 20:30",
        facebookURL: "https://www.facebook.com/soldeinviernosingluten/",
        instagramURL: "",
        URL: "",
        imagenURL: "https://scontent.fmdq1-1.fna.fbcdn.net/v/t1.18169-9/14666270_1334353563242234_3263649987011451089_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=PoUpuH2P-AkAX8jjEYB&_nc_ht=scontent.fmdq1-1.fna&oh=00_AfCDQZ-PrSPeo4QpY83Cn2qGnMMxNXVJWJDVmlwqGdW-Mg&oe=63965E90",
        productos: [],
        estrellas: 5,
        ratingPrecios: 3,
        productosDiabeticos: true,
        productosVeganos: true,
    };
    const comercios = [
        comercio,
        comercio,
        comercio
    ]
    res.status(200).json(comercios);
})

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