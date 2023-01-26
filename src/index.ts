import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import dummyRouter from "./controllers/dummy";
import apiRoutes from "./routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("", apiRoutes);

app.use("/dummy", dummyRouter);

const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running on port: ${port}`);
});
