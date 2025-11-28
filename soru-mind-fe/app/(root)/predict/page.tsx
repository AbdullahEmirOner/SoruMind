import { TopicSelector } from "@/components/predict/topic-selector";

export default function PredictPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-sm-text">Soru Tahmini</h2>
        <p className="text-sm-text-muted">
          LGS müfredatına uygun, yapay zeka destekli soru üretmek için bir konu seçin.
        </p>
      </div>
      
      <TopicSelector />
    </div>
  );
}
