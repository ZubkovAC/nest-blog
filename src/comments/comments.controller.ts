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
import {
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthBearerGuard } from '../guards/AuthBearer.guard';
import { Model } from 'mongoose';
import { commentsSchemaInterface } from './comments.schemas';
import * as jwt from 'jsonwebtoken';
import { Length } from 'class-validator';

class Content {
  @ApiProperty()
  @Length(20, 300)
  content: string;
}

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    @Inject('COMMENTS_MODEL')
    private commentsRepository: Model<commentsSchemaInterface>,
  ) {}
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: {
        id: 'string',
        content: 'string',
        userId: 'string',
        userLogin: 'string',
        createdAt: '2022-11-21T10:22:31.318Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getComments(@Param('id') commentsId: string) {
    const comments = await this.commentsService.getCommentsId(commentsId);
    if (!comments) {
      throw new NotFoundException('not found commentId');
    }
    return comments;
  }
  @Put(':id')
  @HttpCode(204)
  @UseGuards(AuthBearerGuard)
  @ApiBody({
    schema: {
      example: {
        content: 'stringstringstringst',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    schema: {
      example: {
        errorsMessages: [
          {
            message: 'string',
            field: 'string',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'If try edit the comment that is not your own',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiBearerAuth()
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
    if (
      !content?.trim() ||
      content.trim().length < 20 ||
      content.trim().length > 300
    ) {
      throw new HttpException(
        { message: ['content length > 20 && length  < 300'] },
        HttpStatus.BAD_REQUEST,
      );
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
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'If try delete the comment that is not your own',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @HttpCode(204)
  @UseGuards(AuthBearerGuard)
  @ApiBearerAuth()
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
