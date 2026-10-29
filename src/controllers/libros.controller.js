import * as service from "../services/libros.service.js";

export async function listar(req, res, next) {
  try {
    const { buscar, disponibles, pagina = "1", porPagina = "10" } = req.query;
    const resultado = await service.listarLibros({
      buscar, disponibles: disponibles === undefined ? undefined : disponibles === "true",
      pagina: Number(pagina), porPagina: Number(porPagina)
    });
    res.json(resultado);
  } catch (e) { next(e); }
}
export async function obtener(req, res, next) {
  try { res.json(await service.obtenerLibro(Number(req.params.id))); }
  catch (e) { next(e); }
}
export async function crear(req, res, next) {
  try { res.status(201).json(await service.crearLibro(req.body)); }
  catch (e) { next(e); }
}
