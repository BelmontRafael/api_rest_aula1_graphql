import { InputType, PartialType } from '@nestjs/graphql';
import { FilmeInput } from './filme.input';

@InputType()
export class UpdateFilmeInput extends PartialType(FilmeInput) {}