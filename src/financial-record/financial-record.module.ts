import { forwardRef, Module } from '@nestjs/common';
import { FinancialRecordService } from './financial-record.service';
import { FinancialRecordController } from './financial-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialRecord } from './entities/financial-record.entity';
import { ConsumerModule } from 'src/consumer/consumer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialRecord]),
    forwardRef(() => ConsumerModule),
  ],
  providers: [FinancialRecordService],
  controllers: [FinancialRecordController],
  exports: [FinancialRecordService],
})
export class FinancialRecordModule {}
