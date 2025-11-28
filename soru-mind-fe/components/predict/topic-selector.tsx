"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Calculator, FlaskConical, BookOpen, ScrollText, Globe, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

const subjects = [
  {
    id: "matematik",
    name: "Matematik",
    icon: Calculator,
    color: "text-blue-400",
    topics: [
      { id: "carpanlar-katlar", name: "Çarpanlar ve Katlar" },
      { id: "uslu-ifadeler", name: "Üslü İfadeler" },
      { id: "karekoklu-ifadeler", name: "Kareköklü İfadeler" },
      { id: "veri-analizi", name: "Veri Analizi" },
      { id: "basit-olaylar", name: "Basit Olayların Olma Olasılığı" },
      { id: "cebirsel-ifadeler", name: "Cebirsel İfadeler ve Özdeşlikler" },
      { id: "dogrusal-denklemler", name: "Doğrusal Denklemler" },
    ],
  },
  {
    id: "fen-bilimleri",
    name: "Fen Bilimleri",
    icon: FlaskConical,
    color: "text-green-400",
    topics: [
      { id: "mevsimler-iklim", name: "Mevsimler ve İklim" },
      { id: "dna-genetik", name: "DNA ve Genetik Kod" },
      { id: "basinc", name: "Basınç" },
      { id: "madde-endustri", name: "Madde ve Endüstri" },
      { id: "basit-makineler", name: "Basit Makineler" },
      { id: "enerji-donusumleri", name: "Enerji Dönüşümleri" },
    ],
  },
  {
    id: "turkce",
    name: "Türkçe",
    icon: BookOpen,
    color: "text-red-400",
    topics: [
      { id: "sozcukte-anlam", name: "Sözcükte Anlam" },
      { id: "cumlede-anlam", name: "Cümlede Anlam" },
      { id: "paragraf", name: "Paragrafta Anlam" },
      { id: "dil-bilgisi", name: "Dil Bilgisi" },
      { id: "yazim-noktalama", name: "Yazım ve Noktalama" },
      { id: "edebi-turler", name: "Metin Türleri ve Söz Sanatları" },
    ],
  },
  {
    id: "inkilap",
    name: "T.C. İnkılap Tarihi",
    icon: ScrollText,
    color: "text-yellow-400",
    topics: [
      { id: "bir-kahraman", name: "Bir Kahraman Doğuyor" },
      { id: "milli-uyanis", name: "Milli Uyanış" },
      { id: "ya-istiklal", name: "Ya İstiklal Ya Ölüm" },
      { id: "cagdaslasan-turkiye", name: "Çağdaşlaşan Türkiye" },
      { id: "demokratiklesme", name: "Demokratikleşme Çabaları" },
    ],
  },
  {
    id: "ingilizce",
    name: "İngilizce",
    icon: Languages,
    color: "text-purple-400",
    topics: [
      { id: "friendship", name: "Friendship" },
      { id: "teen-life", name: "Teen Life" },
      { id: "in-the-kitchen", name: "In The Kitchen" },
      { id: "on-the-phone", name: "On The Phone" },
      { id: "the-internet", name: "The Internet" },
      { id: "adventures", name: "Adventures" },
    ],
  },
  {
    id: "din-kulturu",
    name: "Din Kültürü",
    icon: Globe,
    color: "text-teal-400",
    topics: [
      { id: "kader-inanci", name: "Kader İnancı" },
      { id: "zekat-sadaka", name: "Zekat ve Sadaka" },
      { id: "din-hayat", name: "Din ve Hayat" },
      { id: "hz-muhammed", name: "Hz. Muhammed'in Örnekliği" },
      { id: "kuran-kerim", name: "Kur'an-ı Kerim ve Özellikleri" },
    ],
  },
];

export function TopicSelector() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handlePredict = () => {
    if (selectedTopic) {
      router.push(`/predict/${selectedTopic}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="bg-sm-surface border-sm-border overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className={cn("p-2 rounded-lg bg-sm-surface-light", subject.color)}>
                <subject.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg text-sm-text">{subject.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="topics" className="border-sm-border">
                  <AccordionTrigger className="text-sm-text-muted hover:text-sm-text">
                    Konu Seç ({subject.topics.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2 pt-2">
                      {subject.topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopic(topic.id)}
                          className={cn(
                            "flex items-center justify-between w-full p-2 rounded-md text-sm transition-all",
                            selectedTopic === topic.id
                              ? "bg-sm-accent text-white"
                              : "text-sm-text-muted hover:bg-sm-surface-light hover:text-sm-text"
                          )}
                        >
                          <span>{topic.name}</span>
                          {selectedTopic === topic.id && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end sticky bottom-6">
        <Button
          size="lg"
          disabled={!selectedTopic}
          onClick={handlePredict}
          className={cn(
            "bg-sm-accent hover:bg-sm-accent-hover text-white transition-all shadow-lg shadow-sm-accent/20",
            !selectedTopic && "opacity-50 cursor-not-allowed"
          )}
        >
          Soru Üret
          <Calculator className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
