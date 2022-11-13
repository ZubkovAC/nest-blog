import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

@Injectable()
export class PostsPOSTMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const errors = [];
    const body = req.body;
    if (!body?.title || body?.title?.trim().length > 30) {
      errors.push({ message: 'title length > 30', field: 'title' });
    }
    if (
      !body?.shortDescription ||
      body?.shortDescription?.trim().length > 100
    ) {
      errors.push({ message: 'title length > 100', field: 'shortDescription' });
    }
    if (!body?.content || body?.content?.trim().length > 1000) {
      errors.push({ message: 'title length > 1000', field: 'content' });
    }
    if (!body?.blogId || body?.blogId) {
      const blogId = mongoose.isValidObjectId(body?.blogId);
      if (!blogId) {
        errors.push({ message: 'not found', field: 'blogId' });
      }
    }
    // console.log('errors', errors);
    if (errors.length > 0) {
      res.status(400).json({
        errorsMessages: errors,
      });
      return;
    }
    next();
  }
}
@Injectable()
export class PostsPUTMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const errors = [];
    const body = req.body;
    if (!body?.title || body?.title?.trim().length > 30) {
      errors.push({ message: 'title length > 30', field: 'title' });
    }
    if (
      !body?.shortDescription ||
      body?.shortDescription?.trim().length > 100
    ) {
      errors.push({ message: 'title length > 100', field: 'shortDescription' });
    }
    if (!body?.content || body?.content?.trim().length > 1000) {
      errors.push({ message: 'title length > 1000', field: 'content' });
    }
    if (!body?.blogId || body?.blogId) {
      const blogId = mongoose.isValidObjectId(body?.blogId);
      if (!blogId) {
        errors.push({ message: 'not found blogId', field: 'blogId' });
      }
    }
    if (!req.params?.id || req.params?.id) {
      const postId = mongoose.isValidObjectId(req.params.id);
      if (!postId) {
        errors.push({ message: 'not found postId', field: 'postId' });
      }
    }
    // console.log('errors', errors);
    if (errors.length > 0) {
      res.status(400).json({
        errorsMessages: errors,
      });
      return;
    }
    next();
  }
}
