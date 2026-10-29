import { validationResult } from "express-validator";

export function validar(req, res, next) {
  const resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: resultado.array().map(({ type, value, msg, path, location }) => ({
        tipo: type, valor: value, mensaje: msg, campo: path, ubicacion: location
      }))
    });
  }
  next();
}
