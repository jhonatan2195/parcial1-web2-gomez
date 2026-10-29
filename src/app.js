import express from "express";
import librosRoutes from "./routes/libros.routes.js";
import prestamosRoutes from "./routes/prestamos.routes.js";
import sociosRoutes from "./routes/socios.routes.js";
import { rutaNoEncontrada, manejarErrores } from "./middlewares/errores.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.get("/health", (req, res) => res.json({ estado: "ok" }));
app.use("/api/libros", librosRoutes);
app.use("/api/prestamos", prestamosRoutes);
app.use("/api/socios", sociosRoutes);
app.use(rutaNoEncontrada);
app.use(manejarErrores);
export default app;
