import { Injectable, BadRequestException } from '@nestjs/common';
import { AtorRepository } from './ator.respository';
import { FilmeRepository } from 'src/filme/filme.respository';
import { AtorInput } from './type/ator.input';
import { AtorType } from './type/ator.type';
import { UpdateAtorInput } from './type/update-ator.input';

@Injectable()
export class AtorService {
	constructor(
        private readonly atorRepository: AtorRepository,
        private readonly filmeRepository: FilmeRepository,
    ) {}

    async create(createAtorDto: AtorInput): Promise<AtorType> {
        await this.validarIds(createAtorDto.filmesIds);
        return this.atorRepository.create(createAtorDto);
    }

    async findAll(): Promise<AtorType[]> {
        return this.atorRepository.findAll();
    }

    async findOne(id: number): Promise<AtorType> {
        return this.atorRepository.findOne(id);
    }

    async update(id: number, updateAtorDto: UpdateAtorInput): Promise<AtorType> {
        await this.validarIds(updateAtorDto.filmesIds);
        return this.atorRepository.update(id, updateAtorDto);
    }

    async remove(id: number): Promise<void> {
        return this.atorRepository.remove(id);
    }

    private async validarIds(filmesIds?: number[]): Promise<void> {
        if (filmesIds && filmesIds?.length > 0) {
            const uniqueIds = [...new Set(filmesIds)];
            const count = await this.filmeRepository.countByIds(uniqueIds);
            if (count !== uniqueIds.length) {
                throw new BadRequestException('Um ou mais IDs de filmes são inválidos.');
            }
        }
    }
    
}