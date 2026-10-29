import { Prisma } from "@prisma/client";

export function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: "Ruta no encontrada" });
}

export function manejarErrores(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error?.status && error.status >= 400 && error.status < 600) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return res.status(409).json({ error: "El valor ya existe" });
    if (error.code === "P2025") return res.status(404).json({ error: "Registro no encontrado" });
  }
  console.error(error);
  return res.status(500).json({ error: "Error interno del servidor" });
}
