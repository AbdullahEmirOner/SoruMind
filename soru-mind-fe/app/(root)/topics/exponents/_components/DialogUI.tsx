'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

type DialogUIProps = {
  activeDialog: { name: string; text: string } | null
  onClose: () => void
}

export default function DialogUI({ activeDialog, onClose }: DialogUIProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [complete, setComplete] = useState(false)

  // Typewriter Effect
  useEffect(() => {
    if (!activeDialog) {
        setDisplayedText('')
        setComplete(false)
        return
    }

    setComplete(false)
    let i = 0
    const fullText = activeDialog.text
    setDisplayedText('')

    const interval = setInterval(() => {
       setDisplayedText(fullText.substring(0, i + 1))
       i++
       if (i >= fullText.length) {
           clearInterval(interval)
           setComplete(true)
       }
    }, 25)

    return () => clearInterval(interval)
  }, [activeDialog])

  return (
    <AnimatePresence>
      {activeDialog && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl flex gap-6 items-center">
             
             {/* Character Avatar Circle */}
             <div className="w-16 h-16 rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-white">{activeDialog.name[0]}</span>
             </div>

             <div className="flex-1 space-y-1">
                <h4 className="text-indigo-400 font-bold text-sm tracking-wider uppercase">
                    {activeDialog.name}
                </h4>
                <p className="text-white text-lg font-medium leading-relaxed">
                    {displayedText}
                    {!complete && <span className="inline-block w-2 h-5 bg-white ml-1 animate-pulse" />}
                </p>
             </div>

             {/* Close/Next Action */}
             <button 
                onClick={onClose}
                className="self-end p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Kapat"
             >
                <ChevronRight className="w-6 h-6 text-white" />
             </button>
          </div>
          
          <div className="absolute -top-3 left-10 text-[10px] text-white/40 uppercase tracking-[0.2em]">
             SoruMind RPG Engine v1.0
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
