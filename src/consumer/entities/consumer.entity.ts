import { ApiProperty } from '@nestjs/swagger';
import { FinancialRecord } from 'src/financial-record/entities/financial-record.entity';
import FinancialRecordType from 'src/financial-record/enums/financial-record-type.enum';
import { User } from 'src/users/entities/user.entity';
import { ChildEntity, OneToMany } from 'typeorm';

@ChildEntity()
export class Consumer extends User {
  @ApiProperty({ type: () => FinancialRecord })
  @OneToMany(
    () => FinancialRecord,
    record => record.consumer,
  )
  records: FinancialRecordType[];
}
