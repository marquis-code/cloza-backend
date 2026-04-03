import { Module } from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { CommerceController } from './commerce.controller';
import { MailerModule } from '../mailer/mailer.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [MailerModule, CartModule],
  providers: [CommerceService],
  controllers: [CommerceController],
  exports: [CommerceService, CartModule],
})
export class CommerceModule {}
