import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cooperated } from "src/modules/cooperated/entities/cooperated.entity";
import { CooperatedSeedService } from "./cooperated-seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([Cooperated])],
  providers: [CooperatedSeedService],
  exports: [CooperatedSeedService],
})
export class CooperatedSeedModule {}
