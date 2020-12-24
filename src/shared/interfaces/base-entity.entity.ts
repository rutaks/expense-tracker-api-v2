import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

class BaseEntity {
  @Exclude()
  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isDisabled: boolean;

  @Exclude()
  @Column()
  @CreateDateColumn()
  createdOn: Date;

  @Exclude()
  @Column()
  @UpdateDateColumn()
  lastUpdatedOn: Date;
}

export default BaseEntity;
