import { MathQuestionService } from './math-question.service';
import { GeneratedQuestionDto } from './dto/generated-question.dto';
import { GenerateContextDto } from './dto/generate-context.dto';
export declare class MathQuestionController {
    private readonly mathQuestionService;
    constructor(mathQuestionService: MathQuestionService);
    generateQuestion(): Promise<GeneratedQuestionDto>;
    generateQuestionFromContext(dto: GenerateContextDto): Promise<GeneratedQuestionDto>;
}
