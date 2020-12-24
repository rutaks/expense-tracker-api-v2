import {
  Body,
  Controller,
  Get,
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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GenericPaginatedResultDto } from 'src/shared/dtos/generic-paginated-results.dto';
import { GenericResponse } from 'src/shared/interfaces/generic-reponse.interface';
import { FinancialRecordDto } from './dtos/financial-record.dto';
import { FinancialRecord } from './entities/financial-record.entity';
import { FinancialRecordService } from './financial-record.service';

@ApiTags('Financial Record')
@ApiBearerAuth()
@Controller('financial-records')
export class FinancialRecordController {
  constructor(
    private readonly financialRecordService: FinancialRecordService,
  ) {}

  @Get(':id')
  @ApiOkResponse({
    description: 'Record found',
    type: FinancialRecord,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRecord(
    @Param('id') id: number,
  ): Promise<GenericResponse<FinancialRecord>> {
    const results = await this.financialRecordService.getRecord(id);
    return { message: 'Record found', results };
  }

  @Get()
  @ApiOkResponse({
    description: 'Records found',
    type: FinancialRecord,
    isArray: true,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRecords(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<GenericResponse<GenericPaginatedResultDto<FinancialRecord>>> {
    const results = await this.financialRecordService.getRecords({
      limit: limit || 10,
      page: page || 1,
    });
    return { message: 'Records found', results };
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Record registered',
    type: FinancialRecordDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(
    @Body() financialRecordDto: FinancialRecordDto,
  ): Promise<GenericResponse<FinancialRecord>> {
    const results = await this.financialRecordService.createRecord(
      financialRecordDto,
    );
    return { message: 'Record registered', results };
  }
}
