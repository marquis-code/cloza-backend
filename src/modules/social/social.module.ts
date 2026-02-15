import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { BullModule } from '@nestjs/bullmq';
import { PostProcessor } from './processors/post.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'post-publishing',
    }),
  ],
  providers: [SocialService, PostProcessor],
  controllers: [SocialController],
  exports: [SocialService],
})
export class SocialModule { }
