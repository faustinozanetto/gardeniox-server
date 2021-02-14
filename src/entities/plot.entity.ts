import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Plant } from './index';

@ObjectType()
@Entity({ name: 'plots' })
export class Plot extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ nullable: true })
  size!: number;

  @Field()
  @Column({ nullable: true })
  maxPlants!: number;

  @OneToMany(() => Plant, (plant: Plant) => plant.plot, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  plants: Array<Plant>;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
