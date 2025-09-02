import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Filme } from "./filme.entity";
import { Ator } from "src/ator/entities/ator.entity";

@Table({
    tableName: "filmes_atores",
    modelName: "FilmesAtores"
})

export class FilmesAtores extends Model{

    @ForeignKey(() => Filme)
    @Column({type: DataType.INTEGER, onDelete: "Cascade" })
    declare id_filme: number

    @ForeignKey(() => Ator)
    @Column({type: DataType.INTEGER, onDelete: "Cascade" })
    declare id_ator: number

    @BelongsTo(() => Filme)
    declare filme: Filme

    @BelongsTo(() => Ator)
    declare ator: Ator
}