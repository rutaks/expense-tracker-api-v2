import { IPaginationMeta } from 'nestjs-typeorm-paginate';

export class GenericPaginatedResultDto<T> {
  data: T[];
  meta?: IPaginationMeta;
}
