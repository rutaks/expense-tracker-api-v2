import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FinancialRecord } from 'src/financial-record/entities/financial-record.entity';
import { GenericPaginatedResultDto } from 'src/shared/dtos/generic-paginated-results.dto';
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

  @Post(':id/financial-records')
  @ApiOkResponse({
    description: 'Records found',
    type: ConsumerDto,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRecordsByConsumert(
    @Param('id') id?: number,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<GenericResponse<GenericPaginatedResultDto<FinancialRecord>>> {
    const results = await this.consumerService.getRecordsByConsumer(id, {
      limit: limit || 10,
      page: page || 1,
    });
    return { message: 'Records found', results };
  }
}
