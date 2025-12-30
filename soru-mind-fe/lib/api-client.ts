export interface GenerateContextDto {
  topic: string;
  details?: string;
}

export interface GeneratedQuestionDto {
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  subtopic: string;
  difficulty: "Kolay" | "Orta" | "Zor";
}

const API_BASE_URL = "http://localhost:3000";

export const apiClient = {
  generateQuestionFromContext: async (dto: GenerateContextDto): Promise<GeneratedQuestionDto> => {
    const response = await fetch(`${API_BASE_URL}/math-question/generate-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },
};
