import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from 'src/modules/organization/entities/organization.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class OrganizationSeedService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private organizationRepository: Repository<OrganizationEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async run() {
    const countOrganization = await this.organizationRepository.count({
      where: {
        document: '92935741000182',
      },
    });

    if (!countOrganization) {
      const manager = await this.userRepository.findOne({
        where: {
          email: 'john.stark@coopartilhar.com',
        },
      });

      if (manager) {
        await this.organizationRepository.save(
          this.organizationRepository.create({
            name: 'BANRICOOP',
            email: 'contato@banricoop.coop.br',
            document: '92935741000182', // Adiciona o documento para garantir a unicidade
            manager: manager,
          }),
        );
      } else {
        console.error('Manager with id 1 not found. Organization creation skipped.');
      }
    }
  }
}
