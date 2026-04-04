import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { MessageClassifierService } from './services/message-classifier.service';
import { MetaProvider } from './providers/meta.provider';
import { FallbackProvider } from './providers/fallback.provider';
import { BillingEngineService } from './services/billing-engine.service';
import { RoutingService } from './services/routing.service';
import { ComplianceService } from './services/compliance.service';
import { BullModule } from '@nestjs/bullmq';
import { FollowUpProcessor } from './processors/followup.processor';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [
    SystemModule,
    BullModule.registerQueue({
      name: 'message-followup',
    }),
  ],
  providers: [
    ConversationsService,
    MessageClassifierService,
    MetaProvider,
    FallbackProvider,
    BillingEngineService,
    RoutingService,
    ComplianceService,
    FollowUpProcessor,
  ],
  controllers: [ConversationsController],
  exports: [
    ConversationsService,
    MessageClassifierService,
    BillingEngineService,
    RoutingService,
    ComplianceService,
  ],
})
export class ConversationsModule {}
