"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var MathQuestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathQuestionService = void 0;
const common_1 = require("@nestjs/common");
const XLSX = __importStar(require("xlsx"));
const path = __importStar(require("path"));
const google_genai_1 = require("@langchain/google-genai");
let MathQuestionService = MathQuestionService_1 = class MathQuestionService {
    logger = new common_1.Logger(MathQuestionService_1.name);
    dataset = [];
    model;
    onModuleInit() {
        this.loadDataset();
        this.model = new google_genai_1.ChatGoogleGenerativeAI({
            apiKey: 'AIzaSyAR9UkrAMtT902J_b5aHaJufUETaST_1Y0',
            model: 'gemini-2.5-flash',
            temperature: 0.7,
        });
    }
    loadDataset() {
        try {
            const filePath = path.join(process.cwd(), 'Cozumlu_Sonuc.xlsx');
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            this.dataset = XLSX.utils.sheet_to_json(sheet);
            this.logger.log(`Loaded ${this.dataset.length} questions from Excel.`);
        }
        catch (error) {
            this.logger.error('Failed to load dataset', error);
        }
    }
    getRandomExamples(count) {
        if (this.dataset.length === 0)
            return [];
        const shuffled = [...this.dataset].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    async generateQuestion() {
        const examples = this.getRandomExamples(3);
        const fewShotText = examples
            .map((ex, i) => `
Ornek ${i + 1}:
Soru: ${ex.soru_metni}
Konu: ${ex.ana_konu}
Zorluk: ${ex.zorluk_seviyesi}
Dogru Cevap: ${ex.doğru}
    `)
            .join('\n');
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
    async generateQuestionFromContext(dto) {
        const { topic, details } = dto;
        const examples = this.getRandomExamples(3);
        const fewShotText = examples
            .map((ex, i) => `
Ornek ${i + 1}:
Soru: ${ex.soru_metni}
Konu: ${ex.ana_konu}
Zorluk: ${ex.zorluk_seviyesi}
Dogru Cevap: ${ex.doğru}
    `)
            .join('\n');
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
    async generateWithPrompt(prompt) {
        try {
            this.logger.log('Navigating to Gemini API...');
            const response = await this.model.invoke(prompt);
            this.logger.log('Gemini API response received.');
            const content = response.content;
            this.logger.log(`Raw Content: ${content}`);
            let cleanedContent = content
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            const firstBrace = cleanedContent.indexOf('{');
            const lastBrace = cleanedContent.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                cleanedContent = cleanedContent.substring(firstBrace, lastBrace + 1);
            }
            let parsed;
            try {
                parsed = JSON.parse(cleanedContent);
            }
            catch (e) {
                this.logger.warn('First JSON parse failed, attempting to sanitize escaped characters...');
                try {
                    const sanitized = cleanedContent.replace(/\\/g, '\\\\');
                    parsed = JSON.parse(sanitized);
                    this.logger.log('Sanitization successful.');
                }
                catch (e2) {
                    this.logger.error('JSON Parse Failed. Raw content was:', content);
                    throw e;
                }
            }
            return {
                text: parsed.text,
                options: parsed.options,
                correctAnswer: parsed.correctAnswer,
                explanation: parsed.explanation,
                topic: parsed.topic || 'Uslu Sayilar',
                difficulty: parsed.difficulty || 'Orta',
            };
        }
        catch (error) {
            this.logger.error('Error in generateQuestion:', error);
            throw error;
        }
    }
};
exports.MathQuestionService = MathQuestionService;
exports.MathQuestionService = MathQuestionService = MathQuestionService_1 = __decorate([
    (0, common_1.Injectable)()
], MathQuestionService);
//# sourceMappingURL=math-question.service.js.map