import { ApiProperty } from '@nestjs/swagger';
import { Consumer } from 'src/consumer/entities/consumer.entity';
import BaseEntity from 'src/shared/interfaces/base-entity.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import FinancialRecordType from '../enums/financial-record-type.enum';

@Entity()
export class FinancialRecord extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @Column('decimal', { scale: 2 })
  amount: number;

  @ApiProperty()
  @Column('text')
  type: FinancialRecordType;

  @ApiProperty({ type: () => Consumer })
  @ManyToOne(
    () => Consumer,
    consumer => consumer.records,
  )
  consumer: Consumer;
}
