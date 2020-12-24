import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import FinancialRecordType from '../enums/financial-record-type.enum';

export class FinancialRecordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Consumer id is required' })
  @IsNumber({}, { message: 'Invalid consumer id, consumer id is not a number' })
  consumerId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Invalid amount, amount is not a number' })
  @Min(0, { message: 'Amount can not be negative' })
  amount: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'type is required' })
  @IsEnum(FinancialRecordType, { message: 'Invalid type' })
  type: FinancialRecordType;
}
