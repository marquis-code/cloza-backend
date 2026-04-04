import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SystemService],
  controllers: [SystemController],
  exports: [SystemService],
})
export class SystemModule {}
