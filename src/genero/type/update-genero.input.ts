import { InputType, PartialType } from '@nestjs/graphql'; 
import { GeneroInput } from './genero.input';

@InputType()
export class UpdateGeneroInput extends PartialType(GeneroInput) {}