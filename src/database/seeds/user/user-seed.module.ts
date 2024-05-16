import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { UserSeedService } from './user-seed.service';
import { UserRole } from 'src/modules/user/entities/user-role.entity';
import { UserStatus } from 'src/modules/user/entities/user-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, UserStatus])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
