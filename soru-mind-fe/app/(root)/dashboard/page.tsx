import React from "react";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { TopicStrengthChart } from "@/components/dashboard/topic-strength-chart";
import { QuestionDistributionChart } from "@/components/dashboard/question-distribution-chart";
import { UpcomingQuestions } from "@/components/dashboard/upcoming-questions";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-sm-text">Panel</h2>
      </div>
      
      <StatsCards />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <PerformanceChart />
        </div>
        <div className="col-span-4 lg:col-span-3">
          <QuestionDistributionChart />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-3">
          <TopicStrengthChart />
        </div>
        <div className="col-span-4">
          <UpcomingQuestions />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <RecentActivity />
      </div>
    </div>
  );
}
