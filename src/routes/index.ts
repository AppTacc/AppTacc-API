import { Router } from "express";
import categoriasRoutes from "./categorias.routes";
import comerciosRoutes from "./comercios.routes";
import localidadesRoutes from "./localidades.routes";
import productosRoutes from "./productos.routes";

const apiRoutes = Router();

apiRoutes.use("/comercios", comerciosRoutes);
apiRoutes.use("/categorias", categoriasRoutes);
apiRoutes.use("/localidades", localidadesRoutes);
apiRoutes.use("/productos", productosRoutes);

export default apiRoutes;
