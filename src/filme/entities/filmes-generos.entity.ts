import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Filme } from "./filme.entity";
import { Genero } from "src/genero/entities/genero.entity";

@Table({
    tableName: "filmes_generos",
    modelName: "FilmesGeneros"
})
export class FilmesGeneros extends Model {
    @ForeignKey(() => Filme)
    @Column({ type: DataType.INTEGER, onDelete: "CASCADE" })
    declare id_filme: number;

    @ForeignKey(() => Genero)
    @Column({ type: DataType.INTEGER, onDelete: "CASCADE" })
    declare id_genero: number;
}