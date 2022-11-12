import express from "express";
import dotenv from "dotenv";

import comerciosRouter from "./controllers/comercio";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/comercios", comerciosRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})