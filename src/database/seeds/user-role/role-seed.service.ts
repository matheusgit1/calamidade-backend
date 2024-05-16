import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/modules/user/entities/user-role.entity';
import { Repository } from 'typeorm';
import { UserRoleEnum } from 'src/modules/user/enums/roles.enum';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(UserRole)
    private repository: Repository<UserRole>,
  ) {}

  async run() {
    console.log('Initializing Role Seed');

    try {
      const countUser = await this.repository.count({
        where: {
          id: UserRoleEnum.user,
        },
      });
      console.log('RoleSeedService - countUser:', countUser);

      if (countUser === 0) {
        const userRole = this.repository.create({
          id: UserRoleEnum.user,
          name: 'User',
        });
        await this.repository.save(userRole);
        console.log('User role created:', userRole);
      } else {
        console.log('User role already exists. Skipping creation.');
      }

      const countAdmin = await this.repository.count({
        where: {
          id: UserRoleEnum.admin,
        },
      });
      console.log('RoleSeedService - countAdmin:', countAdmin);

      if (countAdmin === 0) {
        const adminRole = this.repository.create({
          id: UserRoleEnum.admin,
          name: 'Admin',
        });
        await this.repository.save(adminRole);
        console.log('Admin role created:', adminRole);
      } else {
        console.log('Admin role already exists. Skipping creation.');
      }
    } catch (error) {
      console.error('Error during role seeding:', error);
    }

    console.log('Finished Role Seed');
  }
}
