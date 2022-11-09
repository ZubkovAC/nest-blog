import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const error: any = exception.getResponse();
    if (status === 400) {
      const arrayField = error.message.map((m) => m.split(' ')[0]);
      const filterField = Array.from(new Set(arrayField));
      console.log('123123', filterField);
      response.status(status).json({
        errorsMessages: filterField.map((f) => ({
          message: error.message
            .map((m) => (m.split(' ')[0] !== f ? '' : m))
            .join(', '),
          field: f,
        })),
      });
    }
    if (status === 401) {
      response.status(401).json('Unauthorized');
    }
    if (status === 404) {
      response.status(404).json('Not Found');
    }
  }
}
