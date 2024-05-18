import { Module } from "@nestjs/common";
import { AccidentsService } from "./accidents.service";
import { AccidentsController } from "./accidents.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccidentEntity } from "./entities/accident.entity";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { IsNotExist } from "src/utils/validators/is-not-exists.validator";
import { RequestService } from "../request/request.service";
import { FileService } from "../file/file.service";
import { RequestEntity } from "../request/entities/request.entity";
import { FileEntity } from "../file/entities/file.entity";
import { User } from "../user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AccidentEntity, RequestEntity, FileEntity, User])],
  controllers: [AccidentsController],
  providers: [IsExist, IsNotExist, AccidentsService, RequestService, FileService],
})
export class AccidentsModule {}
