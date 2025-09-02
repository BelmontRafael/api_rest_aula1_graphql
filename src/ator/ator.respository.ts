import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ator } from './entities/ator.entity';
import { Filme } from 'src/filme/entities/filme.entity';
import { Sequelize } from 'sequelize-typescript';
import { AtorType } from './type/ator.type';
import { FilmeSummaryType } from 'src/filme/type/filme-summary.type';
import { UpdateAtorInput } from './type/update-ator.input';
import { AtorInput } from './type/ator.input';

@Injectable()
export class AtorRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

    async create(createAtorDto: AtorInput): Promise<AtorType> {
        const transaction = await this.sequelize.transaction();

        try {
            const ator = await Ator.create(
                {
                    nome: createAtorDto.nome,
                    data_nascimento: createAtorDto.data_nascimento,
                },
                { transaction },
            );

            if (createAtorDto.filmesIds && createAtorDto.filmesIds.length > 0) {
                await ator.$set('filmes', createAtorDto.filmesIds, { transaction });
            }

            await ator.reload({ include: [Filme], transaction });
            await transaction.commit();
            return this.mapToType(ator);
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException('Erro ao criar o ator.', error.message);
        }
    }

    async update(id: number, updateAtorDto: UpdateAtorInput): Promise<AtorType> {
        const ator = await this.findEntityById(id);
        const transaction = await this.sequelize.transaction();

        try {
            await ator.update(updateAtorDto, { transaction });

            if (updateAtorDto.filmesIds) {
                await ator.$set('filmes', updateAtorDto.filmesIds, { transaction });
            }

            await transaction.commit();
            await ator.reload({ include: [Filme] });
            return this.mapToType(ator);
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException('Erro ao atualizar o ator.', error.message);
        }
    }

    async findAll(): Promise<AtorType[]> {
        const atores = await Ator.findAll({
            include: [Filme],
            order: [['nome', 'ASC']],
        });
        return atores.map(ator => this.mapToType(ator));
    }

    async findOne(id: number): Promise<AtorType> {
        const ator = await this.findEntityById(id);
        return this.mapToType(ator);
    }

    async remove(id: number): Promise<void> {
        const ator = await this.findEntityById(id);
        await ator.destroy();
    }

    async countByIds(ids: number[]): Promise<number> {
        if (!ids || ids.length === 0) {
            return 0;
        }
        return Ator.count({
            where: {
                id: ids,
            },
        });
    }

    async findEntityById(id: number): Promise<Ator> {
        const ator = await Ator.findByPk(id, {
            include: [Filme],
        });

        if (!ator) {
            throw new NotFoundException(`Ator com ID ${id} não encontrado.`);
        }
        return ator;
    }

    private mapToType(ator: Ator): AtorType {
        const filmes: FilmeSummaryType[] = (ator.filmes || []).map(filme => ({
            id: filme.id,
            nome: filme.nome,
        }));

        return {
            id: ator.id,
            nome: ator.nome,
            data_nascimento: ator.data_nascimento 
                ? new Date(ator.data_nascimento).toISOString().split('T')[0]
                : null,
            filmes: filmes,
        }
    }
}