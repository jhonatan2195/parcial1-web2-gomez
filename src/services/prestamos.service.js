import { prisma } from "../db.js";
import { conflicto, noEncontrado } from "../errores.js";

export async function crearPrestamo(socioId, libroId) {
  return prisma.$transaction(async (tx) => {
    const socio = await tx.socio.findUnique({ where: { id: socioId } });
    if (!socio) throw noEncontrado("Socio no encontrado");

    const libro = await tx.libro.findUnique({ where: { id: libroId } });
    if (!libro) throw noEncontrado("Libro no encontrado");

    const activos = await tx.prestamo.count({ where: { socioId, estado: "ACTIVO" } });
    if (activos >= 3) throw conflicto("El socio ya tiene 3 préstamos activos");

    // UPDATE condicional y atómico: solo una petición concurrente puede descontar la última unidad.
    const actualizacion = await tx.libro.updateMany({
      where: { id: libroId, ejemplaresDisponibles: { gt: 0 } },
      data: { ejemplaresDisponibles: { decrement: 1 } }
    });
    if (actualizacion.count === 0) throw conflicto("No hay ejemplares disponibles");

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 14);
    const prestamo = await tx.prestamo.create({
      data: { socioId, libroId, fechaLimite },
      include: { libro: { select: { id: true, titulo: true } } }
    });
    return prestamo;
  }, { isolationLevel: "ReadCommitted", maxWait: 10000, timeout: 20000 });
}

export async function devolverPrestamo(id) {
  return prisma.$transaction(async (tx) => {
    const prestamo = await tx.prestamo.findUnique({ where: { id } });
    if (!prestamo) throw noEncontrado("Préstamo no encontrado");
    if (prestamo.estado === "DEVUELTO") throw conflicto("El préstamo ya fue devuelto");

    const actualizacion = await tx.prestamo.updateMany({
      where: { id, estado: "ACTIVO" },
      data: { estado: "DEVUELTO", fechaDevolucion: new Date() }
    });
    if (actualizacion.count === 0) throw conflicto("El préstamo ya fue devuelto");

    await tx.libro.update({
      where: { id: prestamo.libroId },
      data: { ejemplaresDisponibles: { increment: 1 } }
    });
    return tx.prestamo.findUnique({ where: { id }, include: { libro: true, socio: true } });
  });
}

export async function historialPrestamos(socioId, estado) {
  const socio = await prisma.socio.findUnique({ where: { id: socioId } });
  if (!socio) throw noEncontrado("Socio no encontrado");
  return prisma.prestamo.findMany({
    where: { socioId, ...(estado ? { estado } : {}) },
    orderBy: { fechaPrestamo: "desc" },
    include: { libro: { select: { id: true, titulo: true, autor: true } } }
  });
}
