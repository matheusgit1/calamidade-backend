import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoleEnum } from 'src/modules/user/enums/roles.enum';
import { UserStatusEnum } from 'src/modules/user/enums/status.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/modules/user/entities/user-role.entity';
import { UserStatus } from 'src/modules/user/entities/user-status.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private roleRepository: Repository<UserRole>,
    @InjectRepository(UserStatus)
    private statusRepository: Repository<UserStatus>,
  ) {}

  async run() {
    console.log('Initializing User Seed');

    try {
      const countAdmin = await this.userRepository.count({
        where: {
          role: {
            id: UserRoleEnum.admin,
          },
        },
      });
      console.log('UserSeedService - countAdmin:', countAdmin);

      if (countAdmin === 0) {
        const adminRole = await this.roleRepository.findOne({
          where: { id: UserRoleEnum.admin },
        });
        console.log('Admin role found:', adminRole);

        const activeStatus = await this.statusRepository.findOne({
          where: { id: UserStatusEnum.active },
        });
        console.log('Active status found:', activeStatus);

        if (adminRole && activeStatus) {
          const adminUser = this.userRepository.create({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@coopartilhar.com.br',
            password: 'password123',
            role: adminRole,
            status: activeStatus,
            organization: null,
          });
          await this.userRepository.save(adminUser);
          console.log('Admin user created:', adminUser);
        } else {
          console.error('Admin role or active status not found. Skipping admin user creation.');
        }
      }

      const countUser = await this.userRepository.count({
        where: {
          role: {
            id: UserRoleEnum.user,
          },
        },
      });
      console.log('UserSeedService - countUser:', countUser);

      if (countUser === 0) {
        const userRole = await this.roleRepository.findOne({
          where: { id: UserRoleEnum.user },
        });
        console.log('User role found:', userRole);

        const activeStatus = await this.statusRepository.findOne({
          where: { id: UserStatusEnum.active },
        });
        console.log('Active status found:', activeStatus);

        if (userRole && activeStatus) {
          const regularUser = this.userRepository.create({
            firstName: 'John',
            lastName: 'Stark',
            email: 'john.stark@coopartilhar.com',
            password: 'password123',
            role: userRole,
            status: activeStatus,
            organization: null,
          });
          await this.userRepository.save(regularUser);
          console.log('Regular user created:', regularUser);
        } else {
          console.error('User role or active status not found. Skipping regular user creation.');
        }
      }
    } catch (error) {
      console.error('Error during user seeding:', error);
    }
  }
}
