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
      response.status(status).json({
        errorsMessages: error.message.map((m) => ({
          message: m,
          field: m.split(' ')[0],
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
