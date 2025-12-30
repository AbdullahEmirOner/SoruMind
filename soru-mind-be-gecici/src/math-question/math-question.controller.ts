
import { Controller, Get, Post, Body } from '@nestjs/common';
import { MathQuestionService } from './math-question.service';
import { GeneratedQuestionDto } from './dto/generated-question.dto';
import { GenerateContextDto } from './dto/generate-context.dto';

@Controller('math-question')
export class MathQuestionController {
  constructor(private readonly mathQuestionService: MathQuestionService) {}

  @Get('generate')
  async generateQuestion(): Promise<GeneratedQuestionDto> {
    return this.mathQuestionService.generateQuestion();
  }

  @Post('generate-context')
  async generateQuestionFromContext(@Body() dto: GenerateContextDto): Promise<GeneratedQuestionDto> {
    return this.mathQuestionService.generateQuestionFromContext(dto);
  }
}
