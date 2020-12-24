import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Class representing a Request interceptor
 * for API requests to provide logging of users access types
 * a payload object
 * @author Rutakayile Samuel
 * @version 3.0
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url } = request;
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        Logger.log(
          `${user ? 'UserId: ' + user.id : ''}, ${
            user ? 'Name: ' + user.firstName + ' ' + user.lastName : ''
          } made a request to: ${url} ${method} ${duration}ms`,
          context.getClass().name,
        );
      }),
    );
  }
}
