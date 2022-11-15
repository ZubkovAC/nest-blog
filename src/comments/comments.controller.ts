import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthBearerGuard } from '../guards/AuthBearer.guard';
import { Model } from 'mongoose';
import { commentsSchemaInterface } from './comments.schemas';
import * as jwt from 'jsonwebtoken';
@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    @Inject('COMMENTS_MODEL')
    private commentsRepository: Model<commentsSchemaInterface>,
  ) {}
  @Get(':id')
  async getComments(@Param('id') commentsId: string) {
    return this.commentsService.getCommentsId(commentsId);
  }
  @Put(':id')
  @HttpCode(204)
  @UseGuards(AuthBearerGuard)
  async updateCommentId(
    @Param('id') commentId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    const comment = await this.commentsRepository.findOne({
      id: commentId,
    });
    if (!comment) {
      throw new NotFoundException('not found commentId');
    }
    const token = req.headers.authorization.split(' ')[1];
    const userData: any = await jwt.verify(token, process.env.SECRET_KEY);
    if (comment.userId === userData.userId) {
      await this.commentsService.updateCommentId(commentId, content);
      return;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthBearerGuard)
  async deleteCommentId(@Param('id') commentId: string, @Req() req: any) {
    const comment = await this.commentsRepository.findOne({
      id: commentId,
    });
    if (!comment) {
      throw new NotFoundException('not found commentId');
    }
    const token = req.headers.authorization.split(' ')[1];
    const userData: any = await jwt.verify(token, process.env.SECRET_KEY);
    if (comment.userId === userData.userId) {
      await this.commentsService.deleteCommentId(commentId);
      return;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
