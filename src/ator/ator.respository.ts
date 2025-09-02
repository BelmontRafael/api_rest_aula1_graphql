import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ator } from './entities/ator.entity';
import { Filme } from 'src/filme/entities/filme.entity';
import { CreateAtorDto } from './dto/create-ator.dto';
import { AtorDto } from './dto/ator.dto';
import { UpdateAtorDto } from './dto/update-ator.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AtorRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

    async create(createAtorDto: CreateAtorDto): Promise<AtorDto> {
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
            return AtorDto.fromEntity(ator);
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException('Erro ao criar o ator.', error.message);
        }
    }

    async update(id: number, updateAtorDto: UpdateAtorDto): Promise<AtorDto> {
        const ator = await this.findEntityById(id);
        const transaction = await this.sequelize.transaction();

        try {
            await ator.update(updateAtorDto, { transaction });

            if (updateAtorDto.filmesIds) {
                await ator.$set('filmes', updateAtorDto.filmesIds, { transaction });
            }

            await transaction.commit();
            await ator.reload({ include: [Filme] });
            return AtorDto.fromEntity(ator);
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException('Erro ao atualizar o ator.', error.message);
        }
    }

    async findAll(): Promise<AtorDto[]> {
        const atores = await Ator.findAll({
            include: [Filme],
            order: [['nome', 'ASC']],
        });
        return atores.map(ator => AtorDto.fromEntity(ator));
    }

    async findOne(id: number): Promise<AtorDto> {
        const ator = await this.findEntityById(id);
        return AtorDto.fromEntity(ator);
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
}