export interface GenericResponse<T> {
  statusCode?: number;
  message: string;
  results: T;
}
