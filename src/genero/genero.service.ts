import { Injectable } from "@nestjs/common";
import { GeneroRepository } from "./genero.repository";
import { GeneroInput } from "./type/genero.input";
import { GeneroType } from "./type/genero.type";
import { UpdateGeneroInput } from "./type/update-genero.input";

@Injectable()
export class GeneroService {
    constructor(private readonly generoRepository: GeneroRepository) {}

    create(createGeneroDto: GeneroInput): Promise<GeneroType> {
        return this.generoRepository.create(createGeneroDto);
    }

    findAll(): Promise<GeneroType[]> {
        return this.generoRepository.findAll();
    }

    findOne(id: number): Promise<GeneroType> {
        return this.generoRepository.findOne(id);
    }

    update(id: number, updateGeneroDto: UpdateGeneroInput): Promise<GeneroType> {
        return this.generoRepository.update(id, updateGeneroDto);
    }

    remove(id: number): Promise<void> {
        return this.generoRepository.remove(id);
    }
}