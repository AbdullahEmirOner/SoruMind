
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as path from 'path';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { GeneratedQuestionDto } from './dto/generated-question.dto';
import { GenerateContextDto } from './dto/generate-context.dto';

@Injectable()
export class MathQuestionService implements OnModuleInit {
  private readonly logger = new Logger(MathQuestionService.name);
  private dataset: any[] = [];
  private model: ChatGoogleGenerativeAI;

  onModuleInit() {
    this.loadDataset();
    this.model = new ChatGoogleGenerativeAI({
      apiKey: "test",
      model: 'gemini-2.5-flash',
      temperature: 0.7,
    });
  }

  private loadDataset() {
    try {
      const filePath = path.join(process.cwd(), 'Cozumlu_Sonuc.xlsx');
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      this.dataset = XLSX.utils.sheet_to_json(sheet);
      this.logger.log(`Loaded ${this.dataset.length} questions from Excel.`);
    } catch (error) {
      this.logger.error('Failed to load dataset', error);
    }
  }

  private getRandomExamples(count: number): any[] {
    if (this.dataset.length === 0) return [];
    
    // Sort randomly and pick first n
    const shuffled = [...this.dataset].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async generateQuestion(): Promise<GeneratedQuestionDto> {
    const examples = this.getRandomExamples(3);
    
    const fewShotText = examples.map((ex, i) => `
Ornek ${i + 1}:
Soru: ${ex.soru_metni}
Konu: ${ex.ana_konu}
Zorluk: ${ex.zorluk_seviyesi}
Dogru Cevap: ${ex.doğru}
    `).join('\n');

      const prompt = `
Sen bir matematik soru üreticisin. Aşağıdaki örneklere benzer, "Üslü Sayılar" konusunda yeni ve özgün bir matematik sorusu üret.
Sorular LGS (Lise Geçiş Sınavı) seviyesinde olmalı.

ÖNEMLİ KURALLAR:
1. Soru metni anlaşılır ve net olmalı.
2. 5 adet seçenek (A, B, C, D, E) olmalı.
3. Cevap kesinlikle seçeneklerden biri olmalı.
4. Çıktın SADECE JSON formatında olmalı, başka hiçbir açıklama yazma.
5. "correctAnswer" alanı doğru seçeneğin HARFİ olmalı ("A", "B", "C", "D" veya "E").
6. Matematiksel ifadelerde üs için ^ kullan (örn: 2^3). LaTeX kullanma, düz metin kullan.
7. Parantez ve matematiksel sembolleri düzgün kullan.

ÖRNEK SORULAR (Bunlardan esinlen ama kopyalama):
${fewShotText}

Kullanacağın Çıktı Formatı (SADECE BU JSON'U DÖNDÜR):
{
    "text": "Soru metni buraya",
    "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği", "E seçeneği"],
    "correctAnswer": "A",
    "explanation": "Çözüm açıklaması buraya",
    "topic": "Üslü Sayılar",
    "difficulty": "Orta"
}
  `;

    return this.generateWithPrompt(prompt);
  }

  async generateQuestionFromContext(dto: GenerateContextDto): Promise<GeneratedQuestionDto> {
    const { topic, details } = dto;
    const examples = this.getRandomExamples(3);
    
    const fewShotText = examples.map((ex, i) => `
Ornek ${i + 1}:
Soru: ${ex.soru_metni}
Konu: ${ex.ana_konu}
Zorluk: ${ex.zorluk_seviyesi}
Dogru Cevap: ${ex.doğru}
    `).join('\n');

    const prompt = `
Sen bir matematik soru üreticisin. Aşağıdaki parametrelere göre yeni ve özgün bir matematik sorusu üret.

PARAMETRELER:
Konu: ${topic}
Detaylar: ${details || 'Belirtilmemiş, standart LGS zorluğunda olsun.'}

ÖNEMLİ KURALLAR:
1. Soru, verilen "Konu" ile ilgili olmalı.
2. "Detaylar" kısmındaki isteklere DİKKAT ET.
3. Soru metni anlaşılır ve net olmalı.
4. 5 adet seçenek (A, B, C, D, E) olmalı.
5. Cevap kesinlikle seçeneklerden biri olmalı.
6. Çıktın SADECE JSON formatında olmalı, başka hiçbir açıklama yazma.
7. "correctAnswer" alanı doğru seçeneğin HARFİ olmalı ("A", "B", "C", "D" veya "E").
8. Matematiksel ifadelerde üs için ^ kullan (örn: 2^3). LaTeX kullanma, düz metin kullan.
9. Parantez ve matematiksel sembolleri düzgün kullan.

ÖRNEK SORULAR (Format ve stil açısından referans al):
${fewShotText}

Kullanacağın Çıktı Formatı (SADECE BU JSON'U DÖNDÜR):
{
    "text": "Soru metni buraya",
    "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği", "E seçeneği"],
    "correctAnswer": "A",
    "explanation": "Çözüm açıklaması buraya",
    "topic": "${topic}",
    "difficulty": "Orta"
}
`;

    return this.generateWithPrompt(prompt);
  }

  private async generateWithPrompt(prompt: string): Promise<GeneratedQuestionDto> {
    try {
      this.logger.log('Navigating to Gemini API...');
      const response = await this.model.invoke(prompt);
      this.logger.log('Gemini API response received.');
      
      const content = response.content as string;
      this.logger.log(`Raw Content: ${content}`);
      
      // Clean markdown code blocks if present and extract JSON object
      let cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // Attempt to fix common JSON escaping issues if parse fails first time
      // But first, just try to find the first '{' and last '}'
      const firstBrace = cleanedContent.indexOf('{');
      const lastBrace = cleanedContent.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
          cleanedContent = cleanedContent.substring(firstBrace, lastBrace + 1);
      }

      let parsed;
      try {
        parsed = JSON.parse(cleanedContent);
      } catch (e) {
          this.logger.warn('First JSON parse failed, attempting to sanitize escaped characters...');
          // Fallback: This time actually try to parse the sanitized string!
          // Replace single backslashes with double backslashes, but define a more careful regex if possible
          // For now, let's try a simple global replace and see if it helps with LaTeX
          try {
             // Basic attempt to fix LaTeX like \frac into \\frac
             // This is risky but might save the day for simple cases
             const sanitized = cleanedContent.replace(/\\/g, '\\\\');
             parsed = JSON.parse(sanitized); 
             this.logger.log('Sanitization successful.');
          } catch (e2) {
             this.logger.error('JSON Parse Failed. Raw content was:', content);
             throw e; // Throw original error
          }
      }
      
      return {
        text: parsed.text,
        options: parsed.options,
        correctAnswer: parsed.correctAnswer,
        explanation: parsed.explanation,
        topic: parsed.topic || 'Uslu Sayilar',
        difficulty: parsed.difficulty || 'Orta'
      };
    } catch (error) {
      this.logger.error('Error in generateQuestion:', error);
      throw error;
    }
  }
}
