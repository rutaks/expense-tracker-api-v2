import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { FinancialRecord } from 'src/financial-record/entities/financial-record.entity';
import { FinancialRecordModule } from 'src/financial-record/financial-record.module';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { Consumer } from './entities/consumer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumer, Auth, FinancialRecord]),
    forwardRef(() => FinancialRecordModule),
  ],
  controllers: [ConsumerController],
  providers: [ConsumerService],
  exports: [ConsumerService],
})
export class ConsumerModule {}
