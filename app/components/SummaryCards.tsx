import { Card, CardContent, CardHeader, CardTitle } from "../component/ui/card";
import { Progress } from "../component/ui/progress";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle } from "lucide-react";

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week&apos;s Progress</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">87%</div>
          <Progress value={87} className="mb-2" />
          <div className="flex items-center text-xs text-muted-foreground">
            <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-green-600">+5%</span> from last week
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">23</div>
          <p className="text-xs text-muted-foreground mb-2">
            Due this week: 8 tasks
          </p>
          <div className="flex items-center text-xs text-muted-foreground">
            <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
            <span className="text-red-600">-2</span> from yesterday
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Productivity</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">92%</div>
          <Progress value={92} className="mb-2" />
          <div className="flex items-center text-xs text-muted-foreground">
            <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-green-600">+3%</span> efficiency gain
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">$12,847</div>
          <p className="text-xs text-muted-foreground mb-2">
            Target: $15,000
          </p>
          <Progress value={85.6} className="mb-2" />
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="text-green-600">85.6%</span> of monthly goal
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <CheckCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">14</div>
          <p className="text-xs text-muted-foreground mb-2">
            2 launching this month
          </p>
          <div className="flex items-center text-xs text-muted-foreground">
            <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-green-600">+2</span> new projects
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">4.8/5</div>
          <Progress value={96} className="mb-2" />
          <div className="flex items-center text-xs text-muted-foreground">
            <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-green-600">+0.2</span> from last quarter
          </div>
        </CardContent>
      </Card>
    </div>
  );
}