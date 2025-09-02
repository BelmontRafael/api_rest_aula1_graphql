import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ator } from 'src/ator/entities/ator.entity';
import { Sequelize } from 'sequelize-typescript';
import { Filme } from './entities/filme.entity';
import { Genero } from 'src/genero/entities/genero.entity';
import { FilmeType } from './type/filme.type';
import { AtorSummaryType } from 'src/ator/type/ator-summary.type';
import { GeneroType } from 'src/genero/type/genero.type';
import { UpdateFilmeInput } from './type/update-filme.input';
import { FilmeInput } from './type/filme.input';

@Injectable()
export class FilmeRepository {
    constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}
    
    async create(createFilmeDto: FilmeInput): Promise<FilmeType> {
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

            return this.mapToType(filme);
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException('Erro ao criar o filme.', error.message);
        }
    }

    async update(id: number, updateFilmeDto: UpdateFilmeInput): Promise<FilmeType> {
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
            return this.mapToType(filme);
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException('Erro ao atualizar o filme.', error.message);
        }
    }

    async findAll(): Promise<FilmeType[]> {
        const filmes = await Filme.findAll({
            include: [Ator, Genero],
            order: [['nome', 'ASC']],
        });
        return filmes.map(filme => this.mapToType(filme));
    }

    async findOne(id: number): Promise<FilmeType> {
        const filme = await this.findEntityById(id);
        return this.mapToType(filme);
    }

    async remove(id: number): Promise<void> {
        const filme = await this.findEntityById(id);
        await filme.destroy();
    }

    async findActors(filmeId: number): Promise<AtorSummaryType[]> {
        const filme = await this.findEntityById(filmeId);
        return (filme.atores || []).map(ator => AtorSummaryType.fromEntity(ator));
    }

    async addAtores(filme: Filme, atoresIds: number[]): Promise<Filme> {
        await filme.$add('atores', atoresIds);
        return filme.reload({ include: [Ator, Genero] });
    }

    async removeAtor(filme: Filme, ator: Ator): Promise<Filme> {
        await filme.$remove('atores', ator);
        return filme.reload({ include: [Ator, Genero] });
    }

    async addGeneros(filme: Filme, generosIds: number[]): Promise<Filme> {
        await filme.$add('generos', generosIds);
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

    public mapToType(filme: Filme): FilmeType {
        const atores: AtorSummaryType[] = (filme.atores || []).map(ator => ({
            id: ator.id,
            nome: ator.nome,
        }));
        
        const generos: GeneroType[] = (filme.generos || []).map(genero => ({
            id: genero.id,
            nome: genero.nome,
        }));

        return {
            id: filme.id,
            nome: filme.nome,
            ano_lancamento: filme.ano_lancamento,
            sinopse: filme.sinopse,
            atores: atores,
            generos: generos,
        }
    }
}