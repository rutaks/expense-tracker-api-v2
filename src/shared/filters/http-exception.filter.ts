import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { isArray } from 'util';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost): void {
    const TAG = 'HttpExceptionFilter';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as Record<string, unknown>);

    Logger.error(`${request.url} ${request.method}`, exception.stack, TAG);

    response.status(status).json({
      ...this.formatError(error),
      timestamp: new Date().toISOString(),
    });
  }

  formatError(error: string | Record<string, unknown> | any): any {
    if (error.message && !isArray(error.message)) {
      error.message = [error.message];
    }
    return error;
  }
}
