"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Sparkles, Activity, History, Calculator } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingAnimationProps {
  history?: Array<{ topic: string; difficulty: string; }>;
}

export function LoadingAnimation({ history = [] }: LoadingAnimationProps) {
  const [analysisText, setAnalysisText] = useState("Kazanımlar analiz ediliyor...");
  
  // Extract unique topics from history
  const topics = Array.from(new Set(history.map(h => h.topic))).slice(0, 5);

  useEffect(() => {
    const messages = [
      "Kazanımlar analiz ediliyor...",
      "Zorluk seviyesi kalibre ediliyor...",
      ...topics.map(t => `${t} performansınız inceleniyor...`),
      "Benzer sorular taranıyor...",
      "Yeni soru oluşturuluyor..."
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setAnalysisText(messages[index]);
    }, 1500);

    return () => clearInterval(interval);
  }, [topics]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full relative overflow-hidden rounded-xl">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
      
      {/* Glassy Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 p-8 md:p-12 rounded-2xl backdrop-blur-2xl bg-white/10 dark:bg-black/40 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex flex-col items-center max-w-md w-full mx-4"
      >
        <div className="relative mb-8">
          {/* Rotating Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border border-dashed border-white/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 rounded-full border border-white/10"
          />
          
          {/* Central Logo */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 20px rgba(99, 102, 241, 0.3)",
                "0 0 40px rgba(99, 102, 241, 0.6)",
                "0 0 20px rgba(99, 102, 241, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative z-10 p-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl"
          >
            <BrainCircuit className="h-10 w-10 text-white" />
          </motion.div>
        </div>

        {/* Text Area */}
        <div className="text-center space-y-4 h-[80px]">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
            Tahmin Ediliyor...
          </h3>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={analysisText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-indigo-200/80 text-sm font-medium"
            >
              {analysisText}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Stats Preview (Simulated) */}
        <div className="mt-8 flex gap-4 w-full justify-center">
            <div className="flex flex-col items-center gap-1 text-xs text-white/50">
               <History className="h-4 w-4 mb-1 text-indigo-400" />
               <span>Analiz</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center gap-1 text-xs text-white/50">
               <Activity className="h-4 w-4 mb-1 text-emerald-400" />
               <span>Kalibrasyon</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
             <div className="flex flex-col items-center gap-1 text-xs text-white/50">
               <Calculator className="h-4 w-4 mb-1 text-purple-400" />
               <span>Hesaplama</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
