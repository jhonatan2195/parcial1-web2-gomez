import { Router } from "express";
import { param, query } from "express-validator";
import * as controller from "../controllers/prestamos.controller.js";
import { validar } from "../middlewares/validar.js";

const router = Router();
router.get("/:id/prestamos", [
  param("id").isInt({ min: 1 }).withMessage("id debe ser un entero positivo"),
  query("estado").optional().isIn(["ACTIVO", "DEVUELTO"]).withMessage("estado debe ser ACTIVO o DEVUELTO"),
  validar
], controller.historial);
export default router;
