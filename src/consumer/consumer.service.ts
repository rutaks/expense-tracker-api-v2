import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { ConsumerDto } from './dtos/consumer.dto';
import { Consumer } from './entities/consumer.entity';

@Injectable()
export class ConsumerService {
  constructor(
    @InjectRepository(Consumer)
    private readonly consumerRepository: Repository<Consumer>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

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
}
