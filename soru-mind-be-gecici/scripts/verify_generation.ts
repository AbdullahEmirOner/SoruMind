
import { MathQuestionService } from '../src/math-question/math-question.service';

import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  console.log('Starting verification...');
  
  if (!process.env.GOOGLE_API_KEY) {
    console.error('Error: GOOGLE_API_KEY is not set in .env');
    return;
  }

  const service = new MathQuestionService();
  
  console.log('Initializing service...');
  try {
    service.onModuleInit();
  } catch (e) {
    console.error('Init failed:', e);
  }

  console.log('Generating question...');
  try {
    const questions = await service.generateQuestion();
    console.log('------------------------------------------------');
    console.log(JSON.stringify(questions, null, 2));
    console.log('------------------------------------------------');
  } catch (error) {
    console.error('Generation failed:', error);
  }
}

run();
