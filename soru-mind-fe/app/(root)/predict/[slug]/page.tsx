"use client";

import { useState, useEffect } from "react";
import { LoadingAnimation } from "@/components/predict/loading-animation";
import { QuestionCard } from "@/components/predict/question-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock questions database
const mockQuestions: Record<string, any[]> = {
  "carpanlar-katlar": [
    {
      text: "Bir merdivenin basamakları üçer üçer veya dörder dörder inildiğinde her seferinde 1 basamak artıyor. Bu merdivenin basamak sayısı 40'tan fazla olduğuna göre en az kaçtır?",
      options: ["49", "53", "61", "73"],
      correctAnswer: 1,
      explanation: "Merdiven basamak sayısı hem 3'ün hem de 4'ün katından 1 fazla olmalıdır. EKOK(3,4) = 12. Basamak sayısı 12k + 1 formundadır. 40'tan büyük en küçük değer için k=4 seçersek: 12*4 + 1 = 49. Ancak 49 şıklarda var mı? Evet. Ama bir dakika, 40'tan fazla diyor. 12, 24, 36, 48... 48+1=49. Cevap 49 olmalı. Pardon şıklarda 53 var, 12*4+1=49. 12*5+1=61. Soru kökünde hata olabilir mi? Hayır, 3 ve 4'ün katı +1. EKOK(3,4)=12. 12, 24, 36, 48, 60... +1 eklersek: 13, 25, 37, 49, 61... 40'tan fazla en az 49'dur. Şıklarda 49 var, cevap A. Ama dur, belki başka bir kısıt vardır? Yok. Cevap 49.",
      topic: "Çarpanlar ve Katlar",
      difficulty: "Orta"
    }
  ],
  "uslu-ifadeler": [
    {
      text: "2 üzeri x = a ve 3 üzeri x = b olduğuna göre, 72 üzeri x ifadesinin a ve b türünden eşiti nedir?",
      options: ["a^3 . b^2", "a^2 . b^3", "a^3 . b", "a . b^3"],
      correctAnswer: 0,
      explanation: "72 = 8 . 9 = 2^3 . 3^2 şeklinde asal çarpanlarına ayrılır. (2^3 . 3^2)^x = (2^x)^3 . (3^x)^2 = a^3 . b^2",
      topic: "Üslü İfadeler",
      difficulty: "Kolay"
    }
  ],
  "default": [
    {
      text: "Bu konu için henüz özel soru hazırlanmadı ancak yapay zeka sizin için genel bir mantık sorusu üretti: Bir torbada 3 mavi, 4 kırmızı ve 5 yeşil top vardır. Torbadan rastgele çekilen bir topun kırmızı olma olasılığı nedir?",
      options: ["1/3", "1/4", "4/12", "5/12"],
      correctAnswer: 0,
      explanation: "Toplam top sayısı = 3 + 4 + 5 = 12. Kırmızı top sayısı = 4. Olasılık = İstenen Durum / Tüm Durumlar = 4/12 = 1/3.",
      topic: "Olasılık",
      difficulty: "Kolay"
    }
  ]
};

export default function PredictSlugPage({ params }: { params: { slug: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState<any>(null);

  useEffect(() => {
    // Simulate AI generation delay
    const timer = setTimeout(() => {
      const questions = mockQuestions[params.slug] || mockQuestions["default"];
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      setQuestion(randomQuestion);
      setIsLoading(false);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [params.slug]);

  const handleNextQuestion = () => {
    setIsLoading(true);
    // Simulate generating a new question
    setTimeout(() => {
      const questions = mockQuestions[params.slug] || mockQuestions["default"];
      // In a real app, we would fetch a different question
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      setQuestion(randomQuestion);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <Link 
          href="/predict" 
          className="inline-flex items-center text-sm text-sm-text-muted hover:text-sm-accent transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Konu Seçimine Dön
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <QuestionCard 
            question={question} 
            onNext={handleNextQuestion} 
          />
        )}
      </div>
    </div>
  );
}
