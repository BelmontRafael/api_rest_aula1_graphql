import { AutoIncrement, BelongsTo, BelongsToMany, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { FilmesAtores } from "./filmes-atores.entity";
import { Ator } from "src/ator/entities/ator.entity";
import { Genero } from "src/genero/entities/genero.entity";
import { FilmesGeneros } from "./filmes-generos.entity";

@Table({
	tableName: 'filmes',
	modelName: 'Filme'
})

export class Filme extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number

    @Column({type: DataType.STRING, allowNull: false})
    declare nome: string

    @Column({type: DataType.INTEGER, allowNull: false})
    declare ano_lancamento: number

    @Column({type: DataType.STRING})
    declare sinopse: string

    @BelongsToMany(() => Ator, () => FilmesAtores)
    declare atores: Ator[];

    @BelongsToMany(() => Genero, () => FilmesGeneros)
    declare generos: Genero[];
}
