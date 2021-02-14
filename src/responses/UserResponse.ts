import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './FieldError';
import { User } from '../entities/index';

@ObjectType()
export class UserResponse {
  /**
   * Error
   */
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  /**
   * User
   */
  @Field(() => User, { nullable: true })
  user?: User;
}
