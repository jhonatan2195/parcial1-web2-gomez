API de Biblioteca

API REST para la gestión de libros, socios y préstamos de una biblioteca. El proyecto permite consultar información, registrar libros, gestionar préstamos y controlar las devoluciones.

 Tecnologías utilizadas

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Docker

Requisitos

Antes de ejecutar el proyecto, debes tener instalado:

- Node.js y npm.
- Docker y Docker Compose.
- PostgreSQL mediante la configuración Docker del proyecto.

 Instalación

Clona el repositorio o descarga el proyecto y abre una terminal en su carpeta raíz.

Instala las dependencias:

```bash
npm install
```

Configura las variables de entorno copiando el archivo de ejemplo. En PowerShell:

```powershell
Copy-Item .env.example .env
```

Inicia la base de datos:

```bash
docker compose up -d
```

Aplica las migraciones y genera el cliente de Prisma:

```bash
npx prisma migrate deploy
npx prisma generate
```

Carga los datos iniciales:

```bash
npx prisma db seed
```

el seed puede reemplazar los datos existentes. Ejecútalo únicamente cuando corresponda inicializar la base de datos.

 Ejecución

Inicia el servidor con:

```bash
npm run dev
```

La API estará disponible en:

http://localhost:4000

 Funcionalidades principales

- Consulta y búsqueda de libros.
- Filtrado de libros según su disponibilidad.
- Paginación de resultados.
- Registro de nuevos libros.
- Creación y gestión de préstamos.
- Registro de devoluciones.
- Consulta del historial de préstamos por socio.
- Validación de datos y manejo de errores.
- Control de disponibilidad de ejemplares.

 Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/libros` | Consultar libros |
| GET | `/api/libros/:id` | Consultar un libro |
| POST | `/api/libros` | Registrar un libro |
| POST | `/api/prestamos` | Crear un préstamo |
| PATCH | `/api/prestamos/:id/devolucion` | Registrar una devolución |
| GET | `/api/socios/:id/prestamos` | Consultar préstamos de un socio |

Estructura del proyecto

El código está organizado en módulos para separar las responsabilidades:

- `src/routes`: definición de rutas.
- `src/controllers`: gestión de solicitudes y respuestas HTTP.
- `src/services`: lógica de negocio.
- `src/middlewares`: validaciones y manejo de errores.
- `prisma`: esquema de datos, migraciones y datos iniciales.

 Configuración y seguridad

- Mantén las credenciales en el archivo `.env`.
- No publiques `.env` en repositorios públicos.
- Utiliza `.env.example` para documentar las variables necesarias.
- No publiques dependencias instaladas ni archivos generados que puedan reconstruirse.

