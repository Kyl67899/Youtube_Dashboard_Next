"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../component/ui/card";
import { Progress } from "../../component/ui/progress";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { ProjectProvider, useProjects } from "../context/projectContext";
import { useMemo } from "react";

export function SummaryCards() {
  const { projects = [] } = useProjects() ?? {};
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // 🟠 Pending Tasks
  const pendingTasks = projects.filter(p => p.status === "Pending").length;

  // 🟠 This Week's Pending Tasks
  const thisWeekPendingTasks = projects.filter(p => {
    const created = new Date(p.createdAt);
    return p.status === "Pending" && created >= weekStart;
  }).length;

  // 🔵 Team Productivity (avg progress of active projects)
  const activeProjects = projects.filter(p => p.status !== "Completed");
  const teamProductivity = activeProjects.length
    ? Math.round(activeProjects.reduce((sum, p) => sum + p.progress, 0) / activeProjects.length)
    : 0;

  // 💰 Monthly Revenue
  const monthlyRevenue = projects.filter(p => {
    const created = new Date(p.createdAt);
    return created >= monthStart;
  }).reduce((sum, p) => {
    const num = parseFloat(p.budget.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  // 💰 Monthly Goal
  const monthlyGoal = 15000;
  const monthlyProgress = Math.round((monthlyRevenue / monthlyGoal) * 100);

  // 📈 Revenue Change from Last Month
  const lastMonthRevenue = projects.filter(p => {
    const created = new Date(p.createdAt);
    return created >= lastMonthStart && created <= lastMonthEnd;
  }).reduce((sum, p) => {
    const num = parseFloat(p.budget.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const revenueDelta = monthlyRevenue - lastMonthRevenue;

  // 🚀 Launching This Month
  const launchingThisMonth = projects.filter(p => {
    const launch = new Date(p.launchDate);
    return launch >= monthStart && launch <= now;
  }).length;

  // 🆕 New Projects This Month
  const newProjectsThisMonth = projects.filter(p => new Date(p.createdAt) >= monthStart).length;

  // 😊 Client Satisfaction
  const ratedProjects = projects.filter(p => typeof p.clientRating === "number");
  const clientSatisfaction = ratedProjects.length
    ? (ratedProjects.reduce((sum, p) => sum + p.clientRating, 0) / ratedProjects.length).toFixed(1)
    : "N/A";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{pendingTasks}</div>
          <p className="text-xs text-muted-foreground">This week: {thisWeekPendingTasks}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Productivity</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{teamProductivity}%</div>
          <Progress value={teamProductivity} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">${monthlyRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Target: ${monthlyGoal.toLocaleString()}</p>
          <Progress value={monthlyProgress} />
          <p className="text-xs text-muted-foreground">
            {revenueDelta >= 0 ? "+" : "-"}${Math.abs(revenueDelta).toLocaleString()} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CheckCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{activeProjects.length}</div>
          <p className="text-xs text-muted-foreground">{launchingThisMonth} launching this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Projects</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{newProjectsThisMonth}</div>
          <p className="text-xs text-muted-foreground">Added this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Satisfaction</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{clientSatisfaction}/5</div>
          <Progress value={parseFloat(clientSatisfaction) * 20} />
          <p className="text-xs text-muted-foreground">Based on recent ratings</p>
        </CardContent>
      </Card>
    </div>
  );
}