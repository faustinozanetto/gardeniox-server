import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plant } from './index';

@ObjectType()
@Entity({ name: 'diseases' })
export class Disease extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ nullable: false })
  name!: string;

  @Field()
  @Column({ nullable: false })
  information!: string;

  @Field(() => String)
  @Column({ nullable: false })
  image: string;

  @ManyToOne(() => Plant, (plant) => plant.diseases)
  // @JoinColumn({ name: 'plant_id' })
  plant: Plant;
}
