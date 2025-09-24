"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../component/ui/card";
import { Badge } from "../../component/ui/badge";
import { TrendingUp, Users, Target, Award } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useProjects } from "../context/projectContext";
import { useMemo } from "react";

const monthlyData = [
  { month: "Jan", value: 400, projects: 12 },
  { month: "Feb", value: 300, projects: 19 },
  { month: "Mar", value: 600, projects: 23 },
  { month: "Apr", value: 800, projects: 17 },
  { month: "May", value: 700, projects: 25 },
  { month: "Jun", value: 900, projects: 30 },
];

const pieData = [
  { name: "Completed", value: 45, color: "hsl(var(--chart-1))" },
  { name: "In Progress", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Pending", value: 25, color: "hsl(var(--chart-3))" },
];

export function HeroPanel() {
  const { projects = [] } = useProjects() ?? {};

  const totalProjects = projects.length;

  const completed = projects.filter(p => p.status === "Completed").length;
  const inProgress = projects.filter(p => p.status === "In Progress").length;
  const pending = projects.filter(p => p.status === "Pending").length;

  const completionRate = totalProjects
    ? Math.round((completed / totalProjects) * 100)
    : 0;

  const revenue = projects.reduce((sum, p) => {
    const num = parseFloat(p.budget.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const monthlyData = useMemo(() => {
    const map = new Map<string, { month: string; value: number; projects: number }>();

    projects.forEach(p => {
      const date = new Date(p.createdAt);
      const month = date.toLocaleString("default", { month: "short" });
      const key = `${date.getFullYear()}-${month}`;

      if (!map.has(key)) {
        map.set(key, { month, value: 0, projects: 0 });
      }

      const entry = map.get(key)!;
      const budget = parseFloat(p.budget.replace(/[^0-9.]/g, ""));
      entry.value += isNaN(budget) ? 0 : budget;
      entry.projects += 1;
    });

    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [projects]);

  const pieData = [
    { name: "Completed", value: completed, color: "hsl(var(--chart-1))" },
    { name: "In Progress", value: inProgress, color: "hsl(var(--chart-2))" },
    { name: "Pending", value: pending, color: "hsl(var(--chart-3))" },
  ];

  return (
    <div className="grid gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Welcome back, Jack!</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 self-start sm:self-center">
          <Award className="h-4 w-4 mr-1" />
          Top Performer
        </Badge>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {/* Optional: compare to last month */}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">${activeUsers}</div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualizations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Project Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  fontSize={12}
                  tickMargin={8}
                />
                <YAxis
                  fontSize={12}
                  tickMargin={8}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  className="sm:innerRadius-[60] sm:outerRadius-[100]"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-medium flex-shrink-0">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}