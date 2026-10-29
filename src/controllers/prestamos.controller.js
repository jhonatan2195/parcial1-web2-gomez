import * as service from "../services/prestamos.service.js";

export async function crear(req, res, next) {
  try {
    const prestamo = await service.crearPrestamo(req.body.socioId, req.body.libroId);
    res.status(201).json(prestamo);
  } catch (e) { next(e); }
}
export async function devolver(req, res, next) {
  try { res.json(await service.devolverPrestamo(Number(req.params.id))); }
  catch (e) { next(e); }
}
export async function historial(req, res, next) {
  try { res.json(await service.historialPrestamos(Number(req.params.id), req.query.estado)); }
  catch (e) { next(e); }
}
