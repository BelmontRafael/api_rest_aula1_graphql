import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Genero } from "./entities/genero.entity";
import { Filme } from "src/filme/entities/filme.entity";
import { GeneroInput } from "./type/genero.input";
import { GeneroType } from "./type/genero.type";
import { UpdateGeneroInput } from "./type/update-genero.input";
import { FilmeSummaryType } from "src/filme/type/filme-summary.type";

@Injectable()
export class GeneroRepository {

    async create(createGeneroDto: GeneroInput): Promise<GeneroType> {
        try {
            const genero = await Genero.create({ nome: createGeneroDto.nome });
            return this.mapToType(genero);
        } catch (error) {
            
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException(`Gênero com nome '${createGeneroDto.nome}' já existe.`);
            }
            throw new BadRequestException('Erro ao criar o gênero.', error.message);
        }
    }

    async findAll(): Promise<GeneroType[]> {
        const generos = await Genero.findAll({
             include: [Filme],
             order: [['nome', 'ASC']] });
        return generos.map(g => this.mapToType(g));
    }

    async findOne(id: number): Promise<GeneroType> {
        const genero = await this.findEntityById(id);
        return this.mapToType(genero);
    }

    async update(id: number, updateGeneroDto: UpdateGeneroInput): Promise<GeneroType> {
        const genero = await this.findEntityById(id);
        try {
            await genero.update(updateGeneroDto);
            return this.mapToType(genero);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException(`Gênero com nome '${updateGeneroDto.nome}' já existe.`);
            }
            throw new BadRequestException('Erro ao atualizar o gênero.', error.message);
        }
    }

    async remove(id: number): Promise<void> {
        const genero = await this.findEntityById(id);
        await genero.destroy();
    }

    async countByIds(ids: number[]): Promise<number> {
        if (!ids || ids.length === 0) {
            return 0;
        }
        return Genero.count({ where: { id: ids } });
    }    
    
    async findEntityById(id: number): Promise<Genero> {
        const genero = await Genero.findByPk(id, {
            include: [Filme],
        });
        if (!genero) {
            throw new NotFoundException(`Gênero com ID ${id} não encontrado.`);
        }
        return genero;
    }

        private mapToType(genero: Genero): GeneroType {

        const filmes: FilmeSummaryType[] = (genero.filmes || []).map(filme => ({
            id: filme.id,
            nome: filme.nome,
        }));
        return {
            id: genero.id,
            nome: genero.nome,
            filmes: filmes
        };
    }
}