import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

@InputType()
export class FilmeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  nome: string;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @Min(1888)
  ano_lancamento: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sinopse?: string;

  @Field(() => [Int], { nullable: 'itemsAndList', description: 'Array de IDs de atores a serem associados' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  atoresIds?: number[];

  @Field(() => [Int], { nullable: 'itemsAndList', description: 'Array de IDs de gêneros a serem associados' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  generosIds?: number[];
}