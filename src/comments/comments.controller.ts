import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}
  @Get(':id')
  async getComments(@Param('id') commentsId: string) {
    return this.commentsService.getCommentsId(commentsId);
  }
  @Put(':id')
  async updateCommentId(
    @Param('id') commentId: string,
    @Body() content: string,
  ) {
    await this.commentsService.updateCommentId(commentId, content);
    return;
  }
  @Delete(':id')
  async deleteCommentId(@Param('id') commentId: string) {
    await this.commentsService.deleteCommentId(commentId);
    return;
  }
}
