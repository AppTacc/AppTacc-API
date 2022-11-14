import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import comerciosRouter from "./controllers/comercio";
import categoriasRouter from "./controllers/categorias";
import productosRouter from "./controllers/productos";
import dummyRouter from "./controllers/dummy";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/comercios", comerciosRouter);
app.use("/categorias", categoriasRouter);
app.use("/productos", productosRouter);
app.use("/dummy", dummyRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server running on port: ${port}`);
});
