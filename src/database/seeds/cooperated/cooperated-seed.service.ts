import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { Cooperated } from "src/modules/cooperated/entities/cooperated.entity";

@Injectable()
export class CooperatedSeedService {
  constructor(
    @InjectRepository(Cooperated)
    private repository: Repository<Cooperated>,
  ) {}

  async run() {
    const countCooperated = await this.repository.find({ where: { document: Not(IsNull()) } });

    if (countCooperated.length === 0) {
      await this.repository.save([
        {
          email: "admin1@example.com",
          firstName: "admin",
          lastName: "example",
          document: "28839550003",
        },
        {
          email: "admin2@example.com",
          firstName: "admin2",
          lastName: "example",
          document: "13353030069",
        },
        {
          email: "admin3@example.com",
          firstName: "admin3",
          lastName: "example",
          document: "14267215014",
        },
        {
          email: "admin4@example.com",
          firstName: "admin4",
          lastName: "example",
          document: "64349485066",
        },
      ]);
    }
  }
}
