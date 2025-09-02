import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GeneroService } from './genero.service';
import { GeneroType } from './type/genero.type';
import { GeneroInput } from './type/genero.input';
import { UpdateGeneroInput } from './type/update-genero.input';


@Resolver(() => GeneroType)
export class GeneroResolver {
  constructor(private readonly generoService: GeneroService) {}


  @Query(() => [GeneroType], { name: 'generos' })
  async findAll() {
    return this.generoService.findAll();
  }

  @Query(() => GeneroType, { name: 'genero' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.generoService.findOne(id);
  }


  @Mutation(() => GeneroType, { name: 'criarGenero' })
  async create(@Args('input') input: GeneroInput) {
    return this.generoService.create(input);
  }

  @Mutation(() => GeneroType, { name: 'atualizarGenero' })
  async update(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateGeneroInput,
  ) {
    return this.generoService.update(id, input);
  }  

  @Mutation(() => Boolean, { name: 'excluirGenero' })
  async remove(@Args('id', { type: () => Int }) id: number) {
    await this.generoService.remove(id);
    return true;
  }  
}