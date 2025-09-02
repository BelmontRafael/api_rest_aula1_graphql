import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FilmeService } from './filme.service';
import { AtorModule } from 'src/ator/ator.module';
import { FilmeRepository } from './filme.respository';
import { GeneroModule } from 'src/genero/genero.module';
import { FilmeResolver } from './filme.resolver';

@Module({
  imports: [DatabaseModule, forwardRef(() => AtorModule), forwardRef(() => GeneroModule)],
  controllers: [],
  providers: [FilmeService, FilmeRepository, FilmeResolver],
  exports: [FilmeRepository],
})
export class FilmeModule {}