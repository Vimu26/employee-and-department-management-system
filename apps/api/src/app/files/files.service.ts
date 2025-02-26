import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';

@Injectable()
export class FilesService {
  constructor(@InjectModel(DB_COLLECTION_NAMES.FILES) private fileModel: Model<File>) {}
  
  handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    // validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    // validate file size (e.g., max 5mb)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    return { message: 'File uploaded successfully', filePath: file.path };
  }

  async uploadFile(file: Express.Multer.File) {
    const newFile = new this.fileModel({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    });
    return newFile.save();
  }

  async getFiles() {
    return this.fileModel.find().exec();
  }
}
