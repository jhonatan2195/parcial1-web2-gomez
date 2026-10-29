import { Router } from "express";
import { body, param, query } from "express-validator";
import * as controller from "../controllers/libros.controller.js";
import { validar } from "../middlewares/validar.js";

const router = Router();
router.get("/", [
  query("buscar").optional().isString().withMessage("buscar debe ser texto"),
  query("disponibles").optional().isIn(["true", "false"]).withMessage("disponibles solo puede ser true o false"),
  query("pagina").optional().isInt({ min: 1 }).withMessage("pagina debe ser un entero mayor o igual a 1"),
  query("porPagina").optional().isInt({ min: 1, max: 20 }).withMessage("porPagina debe ser un entero entre 1 y 20"),
  validar
], controller.listar);
router.get("/:id", [
  param("id").isInt({ min: 1 }).withMessage("id debe ser un entero positivo"),
  validar
], controller.obtener);
router.post("/", [
  body("titulo").isString().trim().notEmpty().withMessage("titulo es obligatorio"),
  body("autor").isString().trim().notEmpty().withMessage("autor es obligatorio"),
  body("isbn").isString().trim().notEmpty().withMessage("isbn es obligatorio"),
  body("ejemplares").isInt({ min: 1, max: 50 }).withMessage("ejemplares debe ser un entero entre 1 y 50").toInt(),
  validar
], controller.crear);
export default router;
