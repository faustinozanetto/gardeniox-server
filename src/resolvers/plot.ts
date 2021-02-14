import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Plant, Plot } from '../entities/index';

@InputType()
class PlotInput {
  @Field()
  size: number;

  @Field()
  maxPlants: number;
}

@Resolver()
export class PlotResolver {
  @Query(() => [Plot])
  async plots(): Promise<Plot[]> {
    return await Plot.find();
  }

  @Query(() => Plot)
  async plot(@Arg('id') id: number): Promise<Plot | undefined> {
    return await Plot.findOne(id);
  }

  @Mutation(() => Plot)
  async createPlot(@Arg('input') input: PlotInput): Promise<Plot> {
    return await Plot.create({
      ...input,
    }).save();
  }

  @Mutation(() => Boolean)
  async deletePlot(@Arg('id') id: number): Promise<Boolean> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Plot)
      .where('id = :id', { id: id })
      .execute();
    return true;
  }

  @Mutation(() => Number)
  async plantsAmount(@Arg('id') id: number): Promise<number | undefined> {
    const plot = await Plot.findOne(id);
    if (!plot) {
      console.error('Plot not found');
      return;
    }
    const amount = plot?.plants.length;
    if (amount === 0) {
      console.log('No plants registered in this plot');
      return 0;
    }
    return amount;
  }

  @Query(() => Plant)
  async getPlotPlants(@Arg('id') id: number): Promise<Plant | undefined> {
    const plot = await Plot.findOne(id);
    let plantIds;
    if (plot) {
      plantIds = plot?.plants;
      console.log('Undefined plants');
    }
    //@ts-ignore
    return await Plant.findOne(plantIds[0]);
  }
}
