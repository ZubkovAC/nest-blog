import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

@Injectable()
export class PostsPOSTMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const errors = [];
    if (req.method === 'POST') {
      const token = req.headers?.authorization;
      if (token !== 'Basic YWRtaW46cXdlcnR5') {
        res.status(401).json('Unauthorized');
        return;
      }

      const body = req.body;
      if (!body?.title || body?.title?.trim().length > 30) {
        errors.push({ message: 'title length > 30', field: 'title' });
      }
      if (
        !body?.shortDescription ||
        body?.shortDescription?.trim().length > 100
      ) {
        errors.push({
          message: 'shortDescription length > 100',
          field: 'shortDescription',
        });
      }
      if (!body?.content || body?.content?.trim().length > 1000) {
        errors.push({ message: 'content length > 1000', field: 'content' });
      }
      if (!body?.blogId || body.blogId) {
        const blogId = mongoose.isValidObjectId(body?.blogId);
        if (!blogId) {
          errors.push({ message: 'not found', field: 'blogId' });
        }
      }
      if (errors.length > 0) {
        res.status(400).json({
          errorsMessages: errors,
        });
        return;
      }
      console.log('asdfasdf');
      next();
      return;
    }

    if (req.method === 'PUT') {
      const token = req.headers?.authorization;
      if (token !== 'Basic YWRtaW46cXdlcnR5') {
        res.status(401).json('Unauthorized');
        return;
      }

      console.log('asdf');
      const postId = req.url.split('/')[1];
      if (postId) {
        const findPostId = mongoose.isValidObjectId(postId);
        if (!findPostId) {
          res.status(404).json('not found');
          return;
        }
      }

      const errors = [];
      const body = req.body;
      if (!body?.title || body?.title?.trim().length > 30) {
        errors.push({ message: 'title length > 30', field: 'title' });
      }
      if (
        !body?.shortDescription ||
        body?.shortDescription?.trim().length > 100
      ) {
        errors.push({
          message: 'title length > 100',
          field: 'shortDescription',
        });
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
      if (errors.length > 0) {
        res.status(400).json({
          errorsMessages: errors,
        });
        return;
      }
      next();
      return;
    }
    next();
    return;
  }
}
