"use client";

import { motion } from "framer-motion";
import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function SessionStats() {
  const { totalQuestions, totalCorrect, totalWrong, studyTime } = useDashboardStats();

  const stats = [
    {
      label: "Toplam",
      value: totalQuestions,
      icon: Activity,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/50",
    },
    {
      label: "Doğru",
      value: totalCorrect,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "hover:border-green-500/50",
    },
    {
      label: "Yanlış",
      value: totalWrong,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "hover:border-red-500/50",
    },
    {
      label: "Süre",
      value: studyTime,
      icon: Clock,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className={`
            relative overflow-hidden rounded-xl border border-white/5 
            bg-white/5 backdrop-blur-md p-3
            transition-colors duration-300 ${stat.border}
            group cursor-default
          `}
        >
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="flex items-start justify-between mb-2">
            <div className={`p-1.5 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          
          <div className="space-y-0.5">
            <span className="text-xs text-white/50 font-medium">{stat.label}</span>
            <p className="text-lg font-bold text-white/90 font-mono tracking-tight">
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
