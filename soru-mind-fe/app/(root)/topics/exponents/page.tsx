'use client'

import React, { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Center, KeyboardControls, PointerLockControls } from '@react-three/drei'
import ExplodingCube from './_components/ExplodingCube'
import DivisionCube from './_components/DivisionCube'
import Classroom from './_components/Classroom'
import DialogUI from './_components/DialogUI'
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Maximize2, Minimize2, Circle, Move } from 'lucide-react'

const MAX_INSTANCES = 5000 

type Mode = 'positive' | 'negative' | 'zero'

const map = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

// Advanced Dialogue Database
const dialogues: Record<string, string[]> = {
  "Hoca": [
    "Evladım, tahtadaki kurallara iyi bak. Üslü sayılar matematiğin hızlandırılmasıdır.",
    "Büyüme modunda $n^x$ yaptıkça boyutların nasıl katlandığını görüyorsun değil mi?",
    "Bölünme moduna geçersen, bir bütünün nasıl mikroskobik parçalara ayrıldığını keşfedebilirsin.",
    "Sıfırıncı kuvvet neden 1'dir biliyor musun? Çünkü o 'hiçliğin' değil, 'varlığın' başlangıç noktasıdır.",
    "Eğer $10^5$ gibi büyük sayılar denersen, evrenin sınırlarını (ve bilgisayarını) zorlamış olursun. Dikkat et!",
    "Kuralları ezberleme, onları bu 3D dünyada hissetmeye çalış. Şimdi git ve diğerleriyle de konuş."
  ],
  "Ali": [
    "Hocamın anlattığı şu $a^n \cdot a^m = a^{n+m}$ kuralı çok mantıklı.",
    "Yani iki tane 3D küpü yan yana koyunca boyutları toplamış oluyoruz!",
    "Büyüme modunda tabanı 10 yapınca kendimi dev gibi hissediyorum."
  ],
  "Zeynep": [
    "Negatif üsler aslında birer ayna gibi. Büyümenin tam tersi: Bölünme!",
    "Hoca dedi ki $a^{-n} = 1/a^n$. Yani aslında yine bir üs var ama paydada saklanıyor.",
    "Dilimlenmiş pastaları çok seviyorum. Keşke bu simülasyonu yiyebilseydik."
  ],
  "Can": [
    "Ben yazılımcı olacağım. Bilgisayarlar aslında sadece 2'nin kuvvetleriyle çalışır (Binary).",
    "Mesela 2, 4, 8, 16, 32... Bunların hepsi üslü sayı!",
    "Eğer 2 üzeri 10 yaparsan 1024 olur (1 Kilobyte). Hayatın her yerinde bu sayılar var."
  ],
  "Merve": [
    "Sıfırıncı kuvvetin 1 olması bence evrendeki en gizemli şey.",
    "Hangi sayı olursa olsun, sonu hep birliğe çıkıyor. Çok spiritüel değil mi?",
    "Hocamın tahtaya yazdığı 6 numaralı kurala bak: $1^n = 1$. Bir'in gücü her şeye yeter!"
  ]
}

export default function ExponentsPage() {
  const [mode, setMode] = useState<Mode>('positive')
  const [base, setBase] = useState(3)
  const [exponent, setExponent] = useState(3)
  const [gap, setGap] = useState(0.1)

  const [activeDialog, setActiveDialog] = useState<{name: string, text: string} | null>(null)
  const [dialogIndices, setDialogIndices] = useState<Record<string, number>>({})

  const handleInteract = useCallback((name: string) => {
     const lines = dialogues[name] || ["..."]
     const currentIndex = dialogIndices[name] || 0
     
     setActiveDialog({ name, text: lines[currentIndex] })
     
     setDialogIndices(prev => ({
        ...prev,
        [name]: (currentIndex + 1) % lines.length
     }))
  }, [dialogIndices])

  const activeExponent = mode === 'zero' ? 0 : exponent
  const isPositive = mode === 'positive'
  const isNegative = mode === 'negative'

  const instanceCount = isPositive ? Math.pow(base, activeExponent) : 1
  const isTooLarge = instanceCount > MAX_INSTANCES

  return (
    <KeyboardControls map={map}>
    <div className="w-full h-[calc(100vh-4rem)] relative bg-slate-900 overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-96 bg-white/95 backdrop-blur shadow-2xl z-20 p-6 flex flex-col gap-6 md:h-full overflow-y-auto border-r border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Üslü Sayılar</h1>
          <p className="text-slate-500 text-sm mt-1">RPG Matematik Labı v2.0</p>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="positive">Büyüme</TabsTrigger>
            <TabsTrigger value="negative">Bölünme</TabsTrigger>
             <TabsTrigger value="zero">Sıfır</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-8 mt-2">
          <div className="space-y-3">
            <div className="flex justify-between items-center font-bold text-slate-700">
              <label>Taban (n)</label>
              <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded text-sm">{base}</span>
            </div>
            <Slider value={[base]} min={2} max={10} step={1} onValueChange={(v) => setBase(v[0])} />
          </div>

          {mode !== 'zero' && (
            <div className="space-y-3">
               <div className="flex justify-between items-center font-bold text-slate-700">
                <label>{isNegative ? 'Negatif Üs (-x)' : 'Üs (Kuvvet)'}</label>
                <span className={`px-3 py-1 rounded text-sm ${isNegative ? 'text-orange-600 bg-orange-50' : 'text-pink-600 bg-pink-50'}`}>
                    {isNegative ? `-${exponent}` : exponent}
                </span>
              </div>
              <Slider value={[exponent]} min={1} max={6} step={1} onValueChange={(v) => setExponent(v[0])} />
            </div>
          )}

          {isPositive && instanceCount > 1 && (
             <div className="space-y-3 font-bold text-slate-700">
               <div className="flex justify-between items-center">
                <label>Patlama Etkisi</label>
                <span className="text-slate-600 font-mono text-xs">{gap.toFixed(2)}</span>
              </div>
              <Slider value={[gap]} min={0} max={2} step={0.05} onValueChange={(v) => setGap(v[0])} />
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-xl border border-white/10 mt-4">
           <div className="flex items-center gap-2 mb-3 text-indigo-400 font-bold text-xs uppercase tracking-tighter">
              <Move className="w-4 h-4" /> Navigasyon
           </div>
           <p className="text-[11px] text-slate-300 leading-relaxed italic">
              * Ekrana tıkla ve WASD ile yürü. <br/>
              * <b>Herkes sana bakar, meraklanma!</b> <br/>
              * Karakterlere tıklayarak sohbete devam et.
           </p>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
             <div className={`p-4 rounded-xl border shadow-sm ${isTooLarge ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                {isTooLarge ? (
                    <div className="flex items-start gap-2 text-red-700 font-bold uppercase text-xs">
                         <AlertCircle className="w-6 h-6 shrink-0" />
                         <span>Sistem Kapasitesi Aşıldı!</span>
                    </div>
                ) : (
                    <div className="text-center font-black text-slate-800 tracking-tighter">
                        <div className="text-2xl font-mono">
                             {base}<sup className="text-lg">{mode === 'zero' ? 0 : isNegative ? `-${exponent}` : exponent}</sup>
                             {' = '}
                             <span className="text-indigo-600">
                                {mode === 'zero' ? 1 : isNegative ? (1/Math.pow(base, exponent)).toFixed(3) : instanceCount.toLocaleString()}
                             </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="flex-1 relative h-[60vh] md:h-full cursor-crosshair">
        <Canvas shadows camera={{ position: [0, 1.7, 12], fov: 60 }} className="w-full h-full bg-[#020617]">
          <ambientLight intensity={0.5} />
          <Environment preset="night" background={false} />

          <Classroom onInteract={handleInteract} />
          
          <Center top position={[0, 1.5, -5]}>
              {!isTooLarge && (
                  <group scale={1.8}>
                    {mode === 'positive' && <ExplodingCube base={base} exponent={exponent} gap={gap} />}
                    {mode === 'zero' && <ExplodingCube base={base} exponent={0} gap={0} />}
                    {mode === 'negative' && <DivisionCube base={base} exponent={exponent} />}
                  </group>
              )}
          </Center>
          <PointerLockControls />
        </Canvas>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white/20 rounded-full pointer-events-none" />
      </div>

      <DialogUI activeDialog={activeDialog} onClose={() => setActiveDialog(null)} />
    </div>
    </KeyboardControls>
  )
}
