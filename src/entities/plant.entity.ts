import { Field, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Plot, Disease } from './index';

export enum PlantType {
  DEFAULT = 'default',
  TOMATO = 'tomato',
  LETTUCE = 'lettuce',
  CARROT = 'carrot',
  POTATO = 'potato',
  PEPPER = 'pepper',
}

registerEnumType(PlantType, {
  name: 'PlantType',
  description: 'Plant type',
  valuesConfig: {
    CARROT: {
      description: 'Carrot',
    },
  },
});

@ObjectType()
@Entity({ name: 'plants' })
export class Plant extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ nullable: false })
  name!: string;

  @Field()
  @Column({ nullable: false })
  scientificName!: string;

  @Field()
  @Column({ nullable: false })
  variety!: string;

  @Field(() => PlantType)
  @Column({ nullable: false })
  type: PlantType;

  @Field(() => String)
  @Column({ nullable: false })
  image: string;

  @ManyToOne(() => Plot, (plot: Plot) => plot.plants)
  @JoinColumn({ name: 'plot_id' })
  plot: Plot;

  @OneToMany(() => Disease, (disease) => disease.plant, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  diseases: Disease[];

  @Field(() => String)
  @Column()
  seedSprouted!: Date;

  @Field(() => String)
  @Column()
  plantedOn!: Date;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
