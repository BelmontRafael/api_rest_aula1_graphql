import { Sequelize } from "sequelize-typescript"
import { Ator } from "src/ator/entities/ator.entity"
import { Filme } from "src/filme/entities/filme.entity"
import { FilmesAtores } from "src/filme/entities/filmes-atores.entity"
import { FilmesGeneros } from "src/filme/entities/filmes-generos.entity"
import { Genero } from "src/genero/entities/genero.entity"

const dotenv = require('dotenv')

dotenv.config()

export const databaseProviders = [
	{
		provide: 'SEQUELIZE',
		useFactory: async () => {
			const sequelize = new Sequelize({
				dialect: 'postgres',
				host: 'localhost',
				port: Number(process.env.DB_PORT) || 5432,
				username: process.env.DB_USER || 'postgres',
				password: process.env.DB_PASSWORD || '1234',
				database: process.env.DB_NAME || 'postgres',
			})
			sequelize.addModels([
				Filme,
				Ator,
				FilmesAtores,//
				Genero,
				FilmesGeneros
			])
			await sequelize.sync()
			return sequelize
		},
	},
]
