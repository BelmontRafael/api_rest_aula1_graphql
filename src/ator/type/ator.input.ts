import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class AtorInput {
  @Field()
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  @MinLength(2)
  @MaxLength(255)
  nome: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'A data de nascimento deve estar no formato YYYY-MM-DD.' })
  data_nascimento?: string;

  @Field(() => [Int], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  filmesIds?: number[];
}