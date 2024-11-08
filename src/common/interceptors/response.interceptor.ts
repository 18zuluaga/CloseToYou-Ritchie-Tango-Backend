import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next
      .handle()
      .pipe(
        map(data => {
          const request = context.switchToHttp().getRequest();
          const message = this.getSuccessMessage(request); // Método para obtener el mensaje según la acción
          return {
            success: true,
            message,
            data,
          };
        }),
        catchError((error) => {
          const response: ApiResponse<null> = {
            success: false,
            error: error.response?.message || error.message || 'Internal Server Error',
          };
          throw new HttpException(response, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }),
      );
  }

  private getSuccessMessage(request: any): string {
    switch (request.method) {
      case 'POST':
        return 'creado exitosamente';
      case 'GET':
        return 'obtenido  exitosamente';
      case 'PUT':
        return 'actualizado exitosamente';
      case 'DELETE':
        return 'eliminado exitosamente';
      default:
        return 'Operación completada exitosamente';
    }
  }
}
