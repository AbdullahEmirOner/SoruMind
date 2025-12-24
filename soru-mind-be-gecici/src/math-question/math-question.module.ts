
import { Module } from '@nestjs/common';
import { MathQuestionService } from './math-question.service';
import { MathQuestionController } from './math-question.controller';

@Module({
  controllers: [MathQuestionController],
  providers: [MathQuestionService],
})
export class MathQuestionModule {}
