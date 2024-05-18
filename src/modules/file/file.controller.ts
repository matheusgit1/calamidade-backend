import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';

@ApiTags('Files')
@Controller({
  path: 'file',
  version: '1',
})
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiBearerAuth()
  //@UseGuards(AuthGuard('jwt'))
  @Get('presigned-url')
  @ApiQuery({ name: 'fileName', required: true, type: String })
  @ApiQuery({ name: 'folder', required: false, type: String })
  async generatePresignedUrl(
    @Query('fileName') fileName: string,
    @Query('folder') folder?: string,
  ) {
    return this.fileService.generatePresignedUrl(fileName, folder);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getFile(@Param('id') id: string) {
    return this.fileService.getPresignedUrl(id);
  }
}
