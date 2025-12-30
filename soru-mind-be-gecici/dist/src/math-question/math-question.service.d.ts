import { OnModuleInit } from '@nestjs/common';
import { GeneratedQuestionDto } from './dto/generated-question.dto';
import { GenerateContextDto } from './dto/generate-context.dto';
export declare class MathQuestionService implements OnModuleInit {
    private readonly logger;
    private dataset;
    private model;
    onModuleInit(): void;
    private loadDataset;
    private getRandomExamples;
    generateQuestion(): Promise<GeneratedQuestionDto>;
    generateQuestionFromContext(dto: GenerateContextDto): Promise<GeneratedQuestionDto>;
    private generateWithPrompt;
}
