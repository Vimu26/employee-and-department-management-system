import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file);
  }
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file)
  //   return this.filesService.handleFileUpload(file);
  // }

  @Get()
  async getFiles() {
    return this.filesService.getFiles();
  }

  // @Get(':filename')
  // async getFile(@Param('filename') filename: string, @Res() res: Response) {
  //   const filePath = path.join(__dirname, '../../../../uploads', filename);

  //   if (fs.existsSync(filePath)) {
  //     return res.sendFile(filePath);
  //   } else {
  //     throw new NotFoundException('File not found');
  //   }
  // }
}
