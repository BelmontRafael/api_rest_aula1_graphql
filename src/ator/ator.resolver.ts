import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AtorService } from './ator.service';
import { AtorType } from './type/ator.type';
import { AtorInput } from './type/ator.input';
import { UpdateAtorInput } from './type/update-ator.input';

@Resolver(() => AtorType)
export class AtorResolver {
  constructor(private readonly atorService: AtorService) {}

  @Query(() => [AtorType], { name: 'atores' })
  findAll() {
    return this.atorService.findAll();
  }

  @Query(() => AtorType, { name: 'ator' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.atorService.findOne(id);
  }


  @Mutation(() => AtorType, { name: 'criarAtor' })
  create(@Args('input') input: AtorInput) {
    return this.atorService.create(input);
  }

  @Mutation(() => AtorType, { name: 'atualizarAtor' })
  update(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateAtorInput,
  ) {
    return this.atorService.update(id, input);
  }

  @Mutation(() => Boolean, { name: 'excluirAtor' })
  async remove(@Args('id', { type: () => Int }) id: number) {
    await this.atorService.remove(id);
    return true;
  }
}