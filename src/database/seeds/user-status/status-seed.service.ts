import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from 'src/modules/user/entities/user-status.entity';
import { UserStatusEnum } from 'src/modules/user/enums/status.enum';
import { Repository } from 'typeorm';

@Injectable()
export class StatusSeedService {
  constructor(
    @InjectRepository(UserStatus)
    private repository: Repository<UserStatus>,
  ) {}

  async run() {
    console.log('Initializing Status Seed');

    try {
      const count = await this.repository.count();
      console.log('StatusSeedService - count:', count);

      if (count === 0) {
        const activeStatus = this.repository.create({
          id: UserStatusEnum.active,
          name: 'Active',
        });
        const inactiveStatus = this.repository.create({
          id: UserStatusEnum.inactive,
          name: 'Inactive',
        });

        await this.repository.save([activeStatus, inactiveStatus]);
        console.log('User statuses created:', [activeStatus, inactiveStatus]);
      } else {
        console.log('User statuses already exist. Skipping creation.');
      }
    } catch (error) {
      console.error('Error during status seeding:', error);
    }

    console.log('Finished Status Seed');
  }
}
