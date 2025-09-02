import { forwardRef, Module } from "@nestjs/common";
import { GeneroService } from "./genero.service";
import { GeneroRepository } from "./genero.repository";
import { FilmeModule } from "src/filme/filme.module";
import { DatabaseModule } from "src/database/database.module";
import { GeneroResolver } from "./genero.resolver";

@Module({
    imports: [DatabaseModule, forwardRef(() => FilmeModule)],
    controllers: [],
    providers: [GeneroService, GeneroRepository, GeneroResolver],
    exports: [GeneroRepository]
})
export class GeneroModule {}