import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Auth } from 'src/auth/entities/auth.entity';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { Consumer } from './entities/consumer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consumer, Auth])],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {}
