import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn } from 'typeorm';

class Metadata {
  @Exclude()
  @Column({ default: false })
  isDeleted: boolean;

  @ApiProperty()
  @Column()
  @CreateDateColumn()
  createdOn: Date;
}

export default Metadata;
