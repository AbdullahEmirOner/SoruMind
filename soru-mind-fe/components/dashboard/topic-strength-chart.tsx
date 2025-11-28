"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Matematik", score: 85 },
  { name: "Fen Bil.", score: 70 },
  { name: "Türkçe", score: 90 },
  { name: "İnkılap T.", score: 65 },
  { name: "İngilizce", score: 95 },
  { name: "Din K.", score: 80 },
];

export function TopicStrengthChart() {
  return (
    <Card className="col-span-4 lg:col-span-2 bg-sm-surface border-sm-border">
      <CardHeader>
        <CardTitle className="text-sm-text">Konu Başarısı</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#9EA2B7"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              cursor={{ fill: "#1A1D27" }}
              contentStyle={{ backgroundColor: "#131620", borderColor: "#2A2D3A", color: "#E4E6EB" }}
              itemStyle={{ color: "#E4E6EB" }}
            />
            <Bar dataKey="score" fill="#675CFF" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
