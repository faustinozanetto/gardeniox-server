import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Int,
} from 'type-graphql';
import { Plant, PlantType } from '../entities/plant.entity';
import { Disease, Plot } from '../entities';
import { getConnection, getRepository } from 'typeorm';

@InputType()
class PlantInput {
  @Field()
  name!: string;

  @Field()
  scientificName!: string;

  @Field()
  variety!: string;

  @Field(() => PlantType)
  type!: PlantType;

  @Field(() => String)
  image!: string;

  @Field()
  plot!: string;

  @Field({ description: 'Format: YEAR/MONTH/DAY' })
  seedSprouted!: string;

  @Field({ description: 'Format: YEAR/MONTH/DAY' })
  plantedOn!: string;
}

@Resolver()
export class PlantResolver {
  @Query(() => [Plant])
  async plants(): Promise<Plant[]> {
    return Plant.find();
  }

  @Query(() => Plant)
  plant(@Arg('id', () => Int) id: number): Promise<Plant | undefined> {
    return Plant.findOne(id);
  }

  @Mutation(() => Plant)
  async createPlant(@Arg('input') input: PlantInput): Promise<Plant> {
    const plot = await Plot.findOne(input.plot);
    const plant = await Plant.create({
      ...input,
      plot: plot,
      seedSprouted: new Date(input.seedSprouted),
      plantedOn: new Date(input.plantedOn),
    }).save();
    return plant;
  }

  @Mutation(() => Boolean)
  async deletePlant(@Arg('id') id: number): Promise<Boolean> {
    await Plant.delete(id);
    return true;
  }

  @Mutation(() => Disease)
  async addDisease(
    @Arg('id') id: number,
    @Arg('diseaseId') diseaseId: number
  ): Promise<Disease | undefined> {
    const disease = await Disease.findOne(diseaseId);
    if (!disease) {
      console.log('Could not found a disease with the given name!');
      return;
    }
    const plant = await getRepository(Plant).findOne(id, {
      relations: ['diseases'],
    });
    if (!plant) {
      console.log('Could not found a plant with the given id!');
      return;
    }
    plant.diseases.push(disease);
    await getConnection().manager.save(plant);
    return disease;
  }

  @Query(() => [Disease])
  async plantDiseases(
    @Arg('id', () => Int) id: number
  ): Promise<Disease[] | undefined> {
    const plant = await getRepository(Plant).findOne(id, {
      relations: ['diseases'],
    });
    if (!plant) {
      console.log('Could not found a plant with the given id!');
      return;
    }
    return plant?.diseases;
  }

  @Query(() => Boolean)
  async hasDisease(
    @Arg('id') id: number,
    @Arg('name') name: string
  ): Promise<Boolean> {
    const disease = await Disease.findOne({ where: { name } });
    if (!disease) {
      console.log('Could not found a disease with the given name!');
      return false;
    }
    const plant = await getRepository(Plant).findOne(id, {
      relations: ['diseases'],
    });
    if (!plant) {
      console.log('Could not found a plant with the given id!');
      return false;
    }
    // Looping through diseases and checking if there is one with similar id as input.
    let foundOne: boolean = false;
    plant.diseases.map((diseaseI) => {
      foundOne = diseaseI.id === disease.id;
    });

    return foundOne;
  }
}
