import { Router } from "express";
import { body, param } from "express-validator";
import * as controller from "../controllers/prestamos.controller.js";
import { validar } from "../middlewares/validar.js";

const router = Router();
router.post("/", [
  body("socioId").isInt({ min: 1 }).withMessage("socioId debe ser un entero positivo").toInt(),
  body("libroId").isInt({ min: 1 }).withMessage("libroId debe ser un entero positivo").toInt(),
  validar
], controller.crear);
router.patch("/:id/devolucion", [
  param("id").isInt({ min: 1 }).withMessage("id debe ser un entero positivo"),
  validar
], controller.devolver);
export default router;
