import { ObjectType, Field, Int } from '@nestjs/graphql';
import { FilmeSummaryType } from 'src/filme/type/filme-summary.type';

@ObjectType('Ator')
export class AtorType {
  @Field(() => Int)
  id: number;

  @Field()
  nome: string;

  @Field({ nullable: true })
  data_nascimento: string | null;

  @Field(() => [FilmeSummaryType], { nullable: 'itemsAndList' })
  filmes: FilmeSummaryType[];
}