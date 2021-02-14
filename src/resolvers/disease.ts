import { Disease } from '../entities';
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';

@InputType()
class DiseaseInput {
  @Field()
  name!: string;

  @Field()
  information!: string;

  @Field()
  image!: string;
}

@Resolver()
export class DiseaseResolver {
  @Query(() => [Disease])
  async diseases(): Promise<Disease[]> {
    return await Disease.find();
  }

  @Query(() => Disease)
  async disease(
    @Arg('id', () => Int) id: number
  ): Promise<Disease | undefined> {
    const disease = await Disease.findOne(id);
    if (!disease) {
      return undefined;
    }
    return disease;
  }

  @Mutation(() => Disease)
  async createDisease(@Arg('input') input: DiseaseInput) {
    const disease = await Disease.create({
      ...input,
    }).save();

    return disease;
  }
}
