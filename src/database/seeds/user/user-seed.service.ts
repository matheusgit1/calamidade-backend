import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEnum } from 'src/modules/user/enums/roles.enum';
import { UserStatusEnum } from 'src/modules/user/enums/status.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/modules/user/entities/user-role.entity';
import { UserStatus } from 'src/modules/user/entities/user-status.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    @InjectRepository(UserRole)
    private roleRepository: Repository<UserRole>,
    @InjectRepository(UserStatus)
    private statusRepository: Repository<UserStatus>,
  ) {}

  async run() {
    console.log("Inicializando Seed - User");

    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: UserRoleEnum.admin,
        },
      },
    });

    console.log("UserSeedService - countAdmin:", countAdmin);

    if (!countAdmin) {
      const adminRole = await this.roleRepository.findOne({
        where: { id: UserRoleEnum.admin },
      });

      const activeStatus = await this.statusRepository.findOne({
        where: { id: UserStatusEnum.active },
      });

      if (adminRole && activeStatus) {
        await this.repository.save(
          this.repository.create({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@coopartilhar.com.br',
            password: 'password123',
            role: adminRole,
            status: activeStatus,
            organization: null,
          }),
        );
      }
    }

    const countUser = await this.repository.count({
      where: {
        role: {
          id: UserRoleEnum.user,
        },
      },
    });

    if (!countUser) {
      const userRole = await this.roleRepository.findOne({
        where: { id: UserRoleEnum.user },
      });

      const activeStatus = await this.statusRepository.findOne({
        where: { id: UserStatusEnum.active },
      });

      if (userRole && activeStatus) {
        await this.repository.save(
          this.repository.create({
            firstName: 'John',
            lastName: 'Stark',
            email: 'john.stark@coopartilhar.com',
            password: 'password123',
            role: userRole,
            status: activeStatus,
            organization: null,
          }),
        );
      }
    }
  }
}
