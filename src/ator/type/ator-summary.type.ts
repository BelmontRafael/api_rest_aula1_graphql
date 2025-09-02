import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Ator } from '../entities/ator.entity';

@ObjectType('AtorSummary')
export class AtorSummaryType {
  @Field(() => Int)
  id: number;

  @Field()
  nome: string;

    static fromEntity(ator: Ator): AtorSummaryType {
    return {
      id: ator.id,
      nome: ator.nome,
    };
  }
}