import { prisma } from "../db.js";
import { conflicto, noEncontrado } from "../errores.js";

export async function listarLibros({ buscar, disponibles, pagina, porPagina }) {
  const where = {};
  if (buscar) {
    where.OR = [
      { titulo: { contains: buscar, mode: "insensitive" } },
      { autor: { contains: buscar, mode: "insensitive" } }
    ];
  }
  if (disponibles !== undefined) {
    where.ejemplaresDisponibles = disponibles ? { gt: 0 } : { equals: 0 };
  }
  const [datos, total] = await prisma.$transaction([
    prisma.libro.findMany({
      where, orderBy: { titulo: "asc" },
      skip: (pagina - 1) * porPagina, take: porPagina
    }),
    prisma.libro.count({ where })
  ]);
  return { datos, paginacion: { pagina, porPagina, total, totalPaginas: Math.ceil(total / porPagina) } };
}

export async function obtenerLibro(id) {
  const libro = await prisma.libro.findUnique({ where: { id } });
  if (!libro) throw noEncontrado("Libro no encontrado");
  return libro;
}

export async function crearLibro({ titulo, autor, isbn, ejemplares }) {
  const existente = await prisma.libro.findUnique({ where: { isbn } });
  if (existente) throw conflicto("El ISBN ya está registrado");
  return prisma.libro.create({
    data: { titulo, autor, isbn, ejemplaresTotales: ejemplares, ejemplaresDisponibles: ejemplares }
  });
}
