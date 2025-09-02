import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AtorService } from './ator.service';
import { FilmeModule } from 'src/filme/filme.module';
import { AtorRepository } from './ator.respository';
import { AtorResolver } from './ator.resolver';

@Module({
  imports: [DatabaseModule, forwardRef(() => FilmeModule)],
  controllers: [],
  providers: [AtorService, AtorRepository, AtorResolver],
  exports: [AtorRepository, AtorService],
})
export class AtorModule {}