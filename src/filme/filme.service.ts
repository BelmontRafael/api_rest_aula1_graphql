import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FilmeRepository } from './filme.respository';
import { AtorRepository } from 'src/ator/ator.respository';
import { GeneroRepository } from 'src/genero/genero.repository';
import { FilmeInput } from './type/filme.input';
import { FilmeType } from './type/filme.type';
import { UpdateFilmeInput } from './type/update-filme.input';
import { AtorSummaryType } from 'src/ator/type/ator-summary.type';

@Injectable()
export class FilmeService {
    constructor(
        private readonly filmeRepository: FilmeRepository,
        private readonly atorRepository: AtorRepository, 
        private readonly generoRepository: GeneroRepository,
    ) {}

    async create(createFilmeDto: FilmeInput): Promise<FilmeType> {
        await this.validarIds(createFilmeDto.atoresIds, createFilmeDto.generosIds);
        return this.filmeRepository.create(createFilmeDto);
    }

    async findAll(): Promise<FilmeType[]> {
        return this.filmeRepository.findAll();
    }


    async findOne(id: number): Promise<FilmeType> {
        return this.filmeRepository.findOne(id);
    }

    async update(id: number, updateFilmeDto: UpdateFilmeInput): Promise<FilmeType> {
        await this.validarIds(updateFilmeDto.atoresIds, updateFilmeDto.generosIds);
        return this.filmeRepository.update(id, updateFilmeDto);
    }

    async remove(id: number): Promise<void> {
        return this.filmeRepository.remove(id);
    }

    async findActors(filmeId: number): Promise<AtorSummaryType[]> {
        return this.filmeRepository.findActors(filmeId);
  }

  async adicionarAtoresEmFilme(filmeId: number, atorIds: number[]): Promise<FilmeType> {
        const filme = await this.filmeRepository.findEntityById(filmeId);
        
        const uniqueAtorIds = [...new Set(atorIds)];
        const count = await this.atorRepository.countByIds(uniqueAtorIds);
        if (count !== uniqueAtorIds.length) {
            throw new BadRequestException('Um ou mais IDs de atores são inválidos.');
        }

        const filmeAtualizado = await this.filmeRepository.addAtores(filme, uniqueAtorIds);
        return this.filmeRepository.mapToType(filmeAtualizado);
    }

    async removerAtorDeFilme(filmeId: number, atorId: number): Promise<FilmeType> {
        const filme = await this.filmeRepository.findEntityById(filmeId);
        const ator = await this.atorRepository.findEntityById(atorId);

        const filmeAtualizado = await this.filmeRepository.removeAtor(filme, ator);
        return this.filmeRepository.mapToType(filmeAtualizado);
    }

    async adicionarGenerosEmFilme(filmeId: number, generoIds: number[]): Promise<FilmeType> {
        const filme = await this.filmeRepository.findEntityById(filmeId);
        
        const uniqueGeneroIds = [...new Set(generoIds)];
        const count = await this.generoRepository.countByIds(uniqueGeneroIds);
        if (count !== uniqueGeneroIds.length) {
            throw new BadRequestException('Um ou mais IDs de gêneros são inválidos.');
        }

        const filmeAtualizado = await this.filmeRepository.addGeneros(filme, uniqueGeneroIds);
        return this.filmeRepository.mapToType(filmeAtualizado);
    }

    private async validarIds(atoresIds?: number[], generosIds?: number[]): Promise<void> {
        if (atoresIds && atoresIds.length > 0) {
            const uniqueIds = [...new Set(atoresIds)];
            const count = await this.atorRepository.countByIds(uniqueIds);
            if (count !== uniqueIds.length) {
                throw new BadRequestException('Um ou mais IDs de atores são inválidos.');
            }
        }

        if (generosIds &&generosIds?.length > 0) {
            const uniqueIds = [...new Set(generosIds)];
            const count = await this.generoRepository.countByIds(uniqueIds);
            if (count !== uniqueIds.length) {
                throw new BadRequestException('Um ou mais IDs de gêneros são inválidos.');
            }
        }
    }

}