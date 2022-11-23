import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { PostsSchemaInterface } from '../posts/posts.schemas';
import { bloggersSchema } from '../bloggers/blogger.schemas';

// need fix middleware
@Injectable()
export class PostsPOSTMiddleware implements NestMiddleware {
  constructor(
    @Inject('POSTS_MODEL')
    private postsRepository: Model<PostsSchemaInterface>,
    @Inject('BLOGGERS_MODEL')
    private bloggersRepository: Model<bloggersSchema>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const errors = [];
    if (
      (req.method === 'POST' && req.path.split('/')[1] === 'posts') ||
      req.path.split('/')[2] !== undefined
    ) {
      console.log(req.path.split('/'));
      if (req.baseUrl.split('/')[2] !== 'comments') {
        const token = req.headers?.authorization;
        if (token !== 'Basic YWRtaW46cXdlcnR5') {
          console.log('3111');
          res.status(401).json('Unauthorized');
          return;
        }

        const body: any = req.body;
        if (!body?.title?.trim() || body?.title?.trim().length > 30) {
          errors.push({ message: 'title length > 30', field: 'title' });
        }
        if (
          !body?.shortDescription?.trim() ||
          body?.shortDescription?.trim().length > 100
        ) {
          errors.push({
            message: 'shortDescription length > 100',
            field: 'shortDescription',
          });
        }
        if (!body?.content?.trim() || body?.content?.trim().length > 1000) {
          errors.push({ message: 'content length > 1000', field: 'content' });
        }
        if (!body?.blogId || body.blogId) {
          const blogId = await this.bloggersRepository.findOne({
            id: body?.blogId,
          });
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
        next();
        return;
      }
    }

    if (req.method === 'PUT' && req.baseUrl.split('/')[1] === 'posts') {
      const token = req.headers?.authorization;
      if (token !== 'Basic YWRtaW46cXdlcnR5') {
        res.status(401).json('Unauthorized');
        return;
      }

      const postId = req.baseUrl.split('/')[2];
      if (postId) {
        const findPostId = await this.postsRepository.findOne({ id: postId });
        if (!findPostId) {
          res.status(404).json('not found');
          return;
        }
      }
      const errors = [];
      const body: any = req.body;
      if (!body?.title?.trim() || body?.title?.trim().length > 30) {
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
      if (!body?.content?.trim() || body?.content?.trim().length > 1000) {
        errors.push({ message: 'title length > 1000', field: 'content' });
      }
      if (!body?.blogId || body?.blogId) {
        const blogId = await this.bloggersRepository.findOne({
          id: body?.blogId,
        });
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
