import { Injectable, BadRequestException } from '@nestjs/common';
import { AtorRepository } from './ator.respository';
import { FilmeRepository } from 'src/filme/filme.respository';
import { CreateAtorDto } from './dto/create-ator.dto';
import { UpdateAtorDto } from './dto/update-ator.dto';
import { AtorDto } from './dto/ator.dto';


@Injectable()
export class AtorService {
	constructor(
        private readonly atorRepository: AtorRepository,
        private readonly filmeRepository: FilmeRepository,
    ) {}

    async create(createAtorDto: CreateAtorDto): Promise<AtorDto> {
        await this.validarIds(createAtorDto.filmesIds);
        return this.atorRepository.create(createAtorDto);
    }

    async findAll(): Promise<AtorDto[]> {
        return this.atorRepository.findAll();
    }

    async findOne(id: number): Promise<AtorDto> {
        return this.atorRepository.findOne(id);
    }

    async update(id: number, updateAtorDto: UpdateAtorDto): Promise<AtorDto> {
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