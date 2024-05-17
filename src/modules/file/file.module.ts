import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "./entities/file.entity";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity])
  ],
  controllers: [FileController],
  providers: [ConfigModule, ConfigService, FileService],
  exports:[FileService]
})
export class FileModule {}
