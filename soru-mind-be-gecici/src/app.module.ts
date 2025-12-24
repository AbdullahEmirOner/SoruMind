import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathQuestionModule } from './math-question/math-question.module';

@Module({
  imports: [MathQuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
