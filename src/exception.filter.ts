import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

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
      response.status(status).json({
        errorsMessages: filterField.map((f) => ({
          message: error.message
            .map((m) => (m.split(' ')[0] !== f ? '' : m))
            .join(', '),
          field: f,
        })),
      });
      return;
    }
    if (status === 401) {
      response.status(401).json('Unauthorized');
      return;
    }
    if (status === 404) {
      response.status(404).json('Not Found');
      return;
    }
    if (status === 403) {
      response.status(403).json('Forbidden');
      return;
    }
  }
}
