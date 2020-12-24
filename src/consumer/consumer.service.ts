import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { ConsumerDto } from './dtos/consumer.dto';
import { Consumer } from './entities/consumer.entity';
import { FinancialRecord } from 'src/financial-record/entities/financial-record.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { GenericPaginatedResultDto } from 'src/shared/dtos/generic-paginated-results.dto';

@Injectable()
export class ConsumerService {
  constructor(
    @InjectRepository(Consumer)
    private readonly consumerRepository: Repository<Consumer>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(FinancialRecord)
    private readonly financialRecordRepository: Repository<FinancialRecord>,
  ) {}

  /**
   * Creates account for consumer
   * @param consumerDto
   */
  async signUpConsumer(consumerDto: ConsumerDto): Promise<ConsumerDto> {
    const { email, password } = consumerDto;
    const foundAuth = await this.consumerRepository.findOne({
      where: { email },
    });

    if (foundAuth) {
      throw new ConflictException('User with the same email already exists');
    }

    const user = await this.consumerRepository.save(consumerDto);

    let auth = new Auth();
    auth = { ...auth, email, password: await bcrypt.hash(password, 10), user };
    await this.authRepository.save(auth);

    return consumerDto;
  }

  /**
   * Gets consumer by his/her ID
   * @param id
   * @throws NotFoundExpection
   */
  async getConsumer(id: number): Promise<Consumer> {
    const consumer = await this.consumerRepository.findOne({ where: { id } });

    if (!consumer) {
      throw new NotFoundException('User not found');
    }

    return consumer;
  }

  /**
   * Gets consumer's records by his/her ID
   * @param id
   * @throws NotFoundExpection
   */
  async getRecordsByConsumer(
    consumerId: number,
    options: IPaginationOptions,
  ): Promise<GenericPaginatedResultDto<FinancialRecord>> {
    const { items, meta } = await paginate<FinancialRecord>(
      this.financialRecordRepository,
      options,
      {
        where: { isDeleted: false, consumer: { id: consumerId } },
        order: { createdOn: 'DESC' },
      },
    );
    return { data: items, meta };
  }
}
