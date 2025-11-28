"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Doğru", value: 148, color: "#4ADE80" },
  { name: "Yanlış", value: 32, color: "#F87171" },
  { name: "Boş", value: 20, color: "#9EA2B7" },
];

export function QuestionDistributionChart() {
  return (
    <Card className="col-span-4 lg:col-span-2 bg-sm-surface border-sm-border">
      <CardHeader>
        <CardTitle className="text-sm-text">Performans Dağılımı</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#131620", borderColor: "#2A2D3A", color: "#E4E6EB" }}
              itemStyle={{ color: "#E4E6EB" }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
