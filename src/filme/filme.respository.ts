import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ator } from 'src/ator/entities/ator.entity';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { FilmeDto } from './dto/filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { Sequelize } from 'sequelize-typescript';
import { Filme } from './entities/filme.entity';
import { AtorSummaryDto } from 'src/ator/dto/ator-summary.dto';
import { Genero } from 'src/genero/entities/genero.entity';

@Injectable()
export class FilmeRepository {
    constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}
    
    async create(createFilmeDto: CreateFilmeDto): Promise<FilmeDto> {
        const transaction = await this.sequelize.transaction();

        try {
            const filme = await Filme.create(
                {
                    nome: createFilmeDto.nome,
                    ano_lancamento: createFilmeDto.ano_lancamento,
                    sinopse: createFilmeDto.sinopse,
                },
                { transaction },
            );

            if (createFilmeDto.atoresIds && createFilmeDto.atoresIds.length > 0) {
                await filme.$set('atores', createFilmeDto.atoresIds, { transaction })
            }
            if (createFilmeDto.generosIds && createFilmeDto.generosIds.length > 0) {
                await filme.$set('generos', createFilmeDto.generosIds, { transaction });
            }
            
            await filme.reload({ include: [Ator, Genero], transaction });
            await transaction.commit();

            return FilmeDto.fromEntity(filme);
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException('Erro ao criar o filme.', error.message);
        }
    }

    async update(id: number, updateFilmeDto: UpdateFilmeDto): Promise<FilmeDto> {
        const filme = await this.findEntityById(id);
        const transaction = await this.sequelize.transaction();

        try {
            await filme.update(updateFilmeDto, { transaction });

            if (updateFilmeDto.atoresIds) {
                await filme.$set('atores', updateFilmeDto.atoresIds, { transaction });
            }

            if (updateFilmeDto.generosIds) {
                await filme.$set('generos', updateFilmeDto.generosIds, { transaction });
            }

            await transaction.commit();

            await filme.reload({ include: [Ator, Genero] });
            return FilmeDto.fromEntity(filme);
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException('Erro ao atualizar o filme.', error.message);
        }
    }

    async findAll(): Promise<FilmeDto[]> {
        const filmes = await Filme.findAll({
            include: [Ator, Genero],
            order: [['nome', 'ASC']],
        });
        return filmes.map(filme => FilmeDto.fromEntity(filme));
    }

    async findOne(id: number): Promise<FilmeDto> {
        const filme = await this.findEntityById(id);
        return FilmeDto.fromEntity(filme);
    }

    async remove(id: number): Promise<void> {
        const filme = await this.findEntityById(id);
        await filme.destroy();
    }

    async findActors(filmeId: number): Promise<AtorSummaryDto[]> {
        const filme = await this.findEntityById(filmeId);
        return (filme.atores || []).map(ator => AtorSummaryDto.fromEntity(ator));
    }

    async associarAtor(filme: Filme, ator: Ator): Promise<Filme> {
        await filme.$add('atores', ator);
        return filme.reload({ include: [Ator, Genero] });
    }

    async findEntityById(id: number): Promise<Filme> {
        const filme = await Filme.findByPk(id, {
            include: [Ator, Genero],
        });

        if (!filme) {
            throw new NotFoundException(`Filme com ID ${id} não encontrado.`);
        }
        
        return filme;
    }

    async countByIds(ids: number[]): Promise<number> {
        if (!ids || ids.length === 0) {
            return 0;
        }
        return Filme.count({
            where: {
                id: ids,
            },
        });
    }
}