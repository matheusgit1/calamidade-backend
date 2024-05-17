import { Module } from "@nestjs/common";
import { CooperatedService } from "./cooperated.service";
import { CooperatedController } from "./cooperated.controller";
import { IsNotExist } from "../../utils/validators/is-not-exists.validator";
import { IsExist } from "../../utils/validators/is-exists.validator";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cooperated } from "./entities/cooperated.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cooperated])],
  controllers: [CooperatedController],
  providers: [IsExist, IsNotExist, CooperatedService],
})
export class CooperatedModule {}
