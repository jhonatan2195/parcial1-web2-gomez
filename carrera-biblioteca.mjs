
const API = "http://localhost:4000/api";
const libroId = 5;

const peticiones = Array.from({ length: 10 }, (_, i) =>
  fetch(`${API}/prestamos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      socioId: (i % 2) + 1,
      libroId
    })
  }).then(async (r) => ({
    codigo: r.status,
    cuerpo: await r.json().catch(() => null)
  }))
);

const resultados = await Promise.all(peticiones);

console.log("Resultados HTTP:");
for (const resultado of resultados) {
  console.log(
    resultado.codigo,
    JSON.stringify(resultado.cuerpo)
  );
}

const respuestaLibro = await fetch(`${API}/libros/${libroId}`);
const libro = await respuestaLibro.json();

const aceptados = resultados.filter(
  (r) => r.codigo === 201
).length;

const conflictos = resultados.filter(
  (r) => r.codigo === 409
).length;

const otros = resultados.filter(
  (r) => r.codigo !== 201 && r.codigo !== 409
).length;

console.log("Aceptados:", aceptados);
console.log("Conflictos:", conflictos);
console.log("Otras respuestas:", otros);
console.log("Ejemplares disponibles:", libro.ejemplaresDisponibles);
