import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FilmeService } from './filme.service';
import { FilmeType } from './type/filme.type';
import { FilmeInput } from './type/filme.input';
import { UpdateFilmeInput } from './type/update-filme.input';

@Resolver(() => FilmeType)
export class FilmeResolver {
  constructor(private readonly filmeService: FilmeService) {}


  @Query(() => [FilmeType], { name: 'filmes' })
  findAll() {
    return this.filmeService.findAll();
  }

  @Query(() => FilmeType, { name: 'filme' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.filmeService.findOne(id);
  }


  @Mutation(() => FilmeType, { name: 'criarFilme' })
  create(@Args('input') input: FilmeInput) {
    return this.filmeService.create(input);
  }

  @Mutation(() => FilmeType, { name: 'atualizarFilme' })
  update(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateFilmeInput,
  ) {
    return this.filmeService.update(id, input);
  }

  @Mutation(() => Boolean, { name: 'excluirFilme' })
  async remove(@Args('id', { type: () => Int }) id: number) {
    await this.filmeService.remove(id);
    return true;
  }
  
  
  @Mutation(() => FilmeType, { name: 'adicionarAtoresEmFilme' })
  adicionarAtores(
    @Args('filmeId', { type: () => Int }) filmeId: number,
    @Args('atorIds', { type: () => [Int] }) atorIds: number[],
  ) {
    return this.filmeService.adicionarAtoresEmFilme(filmeId, atorIds);
  }

  @Mutation(() => FilmeType, { name: 'removerAtorDeFilme' })
  removerAtor(
    @Args('filmeId', { type: () => Int }) filmeId: number,
    @Args('atorId', { type: () => Int }) atorId: number,
  ) {
    return this.filmeService.removerAtorDeFilme(filmeId, atorId);
  }

  @Mutation(() => FilmeType, { name: 'adicionarGenerosEmFilme' })
  adicionarGeneros(
    @Args('filmeId', { type: () => Int }) filmeId: number,
    @Args('generoIds', { type: () => [Int] }) generoIds: number[],
  ) {
    return this.filmeService.adicionarGenerosEmFilme(filmeId, generoIds);
  }
}