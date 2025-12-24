
import { Controller, Get } from '@nestjs/common';
import { MathQuestionService } from './math-question.service';
import { GeneratedQuestionDto } from './dto/generated-question.dto';

@Controller('math-question')
export class MathQuestionController {
  constructor(private readonly mathQuestionService: MathQuestionService) {}

  @Get('generate')
  async generateQuestion(): Promise<GeneratedQuestionDto> {
    return this.mathQuestionService.generateQuestion();
  }
}
