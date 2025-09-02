import { AutoIncrement, BelongsToMany, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Filme } from "src/filme/entities/filme.entity";
import { FilmesAtores } from "src/filme/entities/filmes-atores.entity";

@Table({
    tableName: "atores",
    modelName: "Ator"
})

export class Ator extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({type: DataType.STRING, allowNull: false})
    declare nome: string

    @Column({type: DataType.DATE})
    declare data_nascimento: Date

    @BelongsToMany(() => Filme, () => FilmesAtores)
    declare filmes: Filme[];

}
