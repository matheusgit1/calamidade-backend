import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { FileSeedService } from './file-seed.service';


@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileSeedService],
  exports: [FileSeedService],
})
export class FileSeedModule {}
