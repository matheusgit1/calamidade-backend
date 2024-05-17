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
  constructor(private readonly filesService: FileService) {}

  @ApiBearerAuth()
  //@UseGuards(AuthGuard('jwt'))
  @Get('presigned-url')
  @ApiQuery({ name: 'fileName', required: true, type: String })
  @ApiQuery({ name: 'mimeType', required: true, type: String })
  async generatePresignedUrl(
    @Query('fileName') fileName: string,
    @Query('mimeType') mimeType: string,
    @Query('folder') folder: string,
  ) {
    return this.filesService.generatePresignedUrl(fileName, mimeType, folder);
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  getFile(@Param('id') id: string) {
    return this.filesService.getPresignedUrl(id);
  }
}
