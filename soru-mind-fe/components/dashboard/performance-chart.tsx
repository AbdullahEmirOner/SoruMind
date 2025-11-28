"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Pzt", accuracy: 65 },
  { name: "Sal", accuracy: 72 },
  { name: "Çar", accuracy: 68 },
  { name: "Per", accuracy: 75 },
  { name: "Cum", accuracy: 82 },
  { name: "Cmt", accuracy: 85 },
  { name: "Paz", accuracy: 88 },
];

export function PerformanceChart() {
  return (
    <Card className="col-span-4 bg-sm-surface border-sm-border">
      <CardHeader>
        <CardTitle className="text-sm-text">Başarı Artışı</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#9EA2B7"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9EA2B7"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" vertical={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#131620", borderColor: "#2A2D3A", color: "#E4E6EB" }}
              itemStyle={{ color: "#E4E6EB" }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#675CFF"
              strokeWidth={2}
              dot={{ fill: "#675CFF" }}
              activeDot={{ r: 6, fill: "#7A70FF" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
