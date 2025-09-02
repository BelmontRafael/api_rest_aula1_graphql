import { AutoIncrement, BelongsToMany, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Filme } from "src/filme/entities/filme.entity";
import { FilmesGeneros } from "src/filme/entities/filmes-generos.entity";

@Table({
    tableName: "generos",
    modelName: "Genero"
})
export class Genero extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    declare nome: string;

    @BelongsToMany(() => Filme, () => FilmesGeneros)
    declare filmes: Filme[];
}