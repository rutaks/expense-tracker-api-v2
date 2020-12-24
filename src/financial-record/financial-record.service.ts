import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ConsumerService } from 'src/consumer/consumer.service';
import { GenericPaginatedResultDto } from 'src/shared/dtos/generic-paginated-results.dto';
import { Repository } from 'typeorm';
import { FinancialRecordDto } from './dtos/financial-record.dto';
import { FinancialRecord } from './entities/financial-record.entity';

@Injectable()
export class FinancialRecordService {
  constructor(
    @InjectRepository(FinancialRecord)
    private readonly financialRecordRepository: Repository<FinancialRecord>,
    private readonly consumerService: ConsumerService,
  ) {}

  async getRecord(id: number): Promise<FinancialRecord> {
    const record = this.financialRecordRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException('Record not found');
    }

    return record;
  }

  async getRecords(
    options: IPaginationOptions,
  ): Promise<GenericPaginatedResultDto<FinancialRecord>> {
    const { items, meta } = await paginate<FinancialRecord>(
      this.financialRecordRepository,
      options,
      {
        where: { isDeleted: false },
        order: { createdOn: 'DESC' },
      },
    );
    return { data: items, meta };
  }

  async createRecord(
    createFinancialRecordDto: FinancialRecordDto,
  ): Promise<FinancialRecord> {
    const { consumerId } = createFinancialRecordDto;
    const consumer = await this.consumerService.getConsumer(consumerId);

    let record = new FinancialRecord();
    record = { ...record, ...createFinancialRecordDto, consumer };
    return await this.financialRecordRepository.save(record);
  }

  async modifyRecord(
    id: number,
    modifyFinancialRecordDto: FinancialRecordDto,
  ): Promise<FinancialRecord> {
    let record = await this.getRecord(id);
    record = { ...record, ...modifyFinancialRecordDto };
    return await this.financialRecordRepository.save(record);
  }

  async removeRecord(id: number): Promise<FinancialRecord> {
    const record = await this.getRecord(id);
    return this.financialRecordRepository.save({ ...record, isDeleted: true });
  }
}
