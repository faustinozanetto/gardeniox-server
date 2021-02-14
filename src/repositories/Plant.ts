import { Plant} from '../entities/plant.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Plant)
export class PlantRepository extends Repository<Plant> {}
