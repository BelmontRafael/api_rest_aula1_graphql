import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('FilmeSummary')
export class FilmeSummaryType {
  @Field(() => Int)
  id: number;

  @Field()
  nome: string;
}