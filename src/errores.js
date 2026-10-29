export class ErrorAplicacion extends Error {
  constructor(mensaje, status) {
    super(mensaje);
    this.name = "ErrorAplicacion";
    this.status = status;
  }
}
export const noEncontrado = (mensaje) => new ErrorAplicacion(mensaje, 404);
export const conflicto = (mensaje) => new ErrorAplicacion(mensaje, 409);
export const solicitudInvalida = (mensaje) => new ErrorAplicacion(mensaje, 400);
