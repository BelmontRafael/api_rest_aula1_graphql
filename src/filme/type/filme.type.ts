import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AtorSummaryType } from 'src/ator/type/ator-summary.type';
import { GeneroType } from 'src/genero/type/genero.type';


@ObjectType('Filme')
export class FilmeType {
  @Field(() => Int)
  id: number;

  @Field()
  nome: string;

  @Field(() => Int)
  ano_lancamento: number;

  @Field(() =>  String, { nullable: true })
  sinopse: string | null;

  @Field(() => [AtorSummaryType], { nullable: 'itemsAndList' })
  atores: AtorSummaryType[];

  @Field(() => [GeneroType], { nullable: 'itemsAndList' })
  generos: GeneroType[];
}