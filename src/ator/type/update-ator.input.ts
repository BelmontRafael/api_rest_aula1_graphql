import { InputType, PartialType } from '@nestjs/graphql';
import { AtorInput } from './ator.input';

@InputType()
export class UpdateAtorInput extends PartialType(AtorInput) {}