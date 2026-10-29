import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // IDs explícitos y orden determinista para coincidir con la guía.
  await prisma.prestamo.deleteMany();
  await prisma.libro.deleteMany();
  await prisma.socio.deleteMany();

  await prisma.socio.createMany({
    data: [
      { id: 1, nombre: "Laura Gómez", email: "laura@ucaldas.edu.co" },
      { id: 2, nombre: "Andrés Ríos", email: "andres@ucaldas.edu.co" },
      { id: 3, nombre: "Sofía Marín", email: "sofia@ucaldas.edu.co" }
    ]
  });

  await prisma.libro.createMany({
    data: [
      { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", isbn: "ISBN-001", ejemplaresTotales: 3, ejemplaresDisponibles: 3 },
      { id: 2, titulo: "El amor en los tiempos del cólera", autor: "Gabriel García Márquez", isbn: "ISBN-002", ejemplaresTotales: 2, ejemplaresDisponibles: 1 },
      { id: 3, titulo: "Clean Code", autor: "Robert C. Martin", isbn: "ISBN-003", ejemplaresTotales: 1, ejemplaresDisponibles: 0 },
      { id: 4, titulo: "Node.js Design Patterns", autor: "Mario Casciaro", isbn: "ISBN-004", ejemplaresTotales: 2, ejemplaresDisponibles: 1 },
      { id: 5, titulo: "La vorágine", autor: "José Eustasio Rivera", isbn: "ISBN-005", ejemplaresTotales: 1, ejemplaresDisponibles: 1 }
    ]
  });

  const ahora = new Date();
  const limite = new Date(ahora);
  limite.setDate(limite.getDate() + 14);
  await prisma.prestamo.createMany({
    data: [
      { id: 1, socioId: 3, libroId: 2, fechaLimite: limite },
      { id: 2, socioId: 3, libroId: 3, fechaLimite: limite },
      { id: 3, socioId: 3, libroId: 4, fechaLimite: limite }
    ]
  });

  // Ajusta secuencias tras insertar IDs explícitos.
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Socio"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "Socio"))`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Libro"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "Libro"))`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Prestamo"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "Prestamo"))`;

  console.log("Seed de biblioteca cargado correctamente.");
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
