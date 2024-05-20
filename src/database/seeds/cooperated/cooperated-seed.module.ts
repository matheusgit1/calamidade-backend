import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CooperatedSeedService } from "./cooperated-seed.service";
import { CooperatedEntity } from "src/modules/cooperated/entities/cooperated.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CooperatedEntity])],
  providers: [CooperatedSeedService],
  exports: [CooperatedSeedService],
})
export class CooperatedSeedModule {}
