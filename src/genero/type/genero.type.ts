import { ObjectType, Field, Int } from '@nestjs/graphql';
import { FilmeSummaryType } from 'src/filme/type/filme-summary.type';

@ObjectType('Genero')
export class GeneroType {
  @Field(() => Int)
  id: number;

  @Field()
  nome: string;

  @Field(() => [FilmeSummaryType], { nullable: 'itemsAndList' })
  filmes?: FilmeSummaryType[];
}