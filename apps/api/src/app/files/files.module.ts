import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModel } from './file.model';
import { join } from 'path';

@Module({
  imports: [
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: path.join(__dirname, '../../../uploads'),
    //     filename: (req, file, cb) => {
    //       const filename = `${Date.now()}-${file.originalname}`;
    //       cb(null, filename);
    //     },
    //   }),
    // }),
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),  // Use Nx root for the uploads folder
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
    MongooseModule.forFeature([
          { name: DB_COLLECTION_NAMES.FILES, schema: FileModel },
        ]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
