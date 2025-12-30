import { OnModuleInit } from '@nestjs/common';
import { GeneratedQuestionDto } from './dto/generated-question.dto';
export declare class MathQuestionService implements OnModuleInit {
    private readonly logger;
    private dataset;
    private model;
    onModuleInit(): void;
    private loadDataset;
    private getRandomExamples;
    generateQuestion(): Promise<GeneratedQuestionDto>;
}
