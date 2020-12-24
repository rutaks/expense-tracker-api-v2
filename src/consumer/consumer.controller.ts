import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/shared/interfaces/generic-reponse.interface';
import { ConsumerService } from './consumer.service';
import { ConsumerDto } from './dtos/consumer.dto';

@ApiTags('Consumer')
@ApiBearerAuth()
@Controller('consumers')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Post('sign-up')
  @ApiOkResponse({
    description: 'Sign up successful',
    type: ConsumerDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(
    @Body() consumerDto: ConsumerDto,
  ): Promise<GenericResponse<ConsumerDto>> {
    const results = await this.consumerService.signUpConsumer(consumerDto);
    return { message: 'Sign up successful', results };
  }
}
