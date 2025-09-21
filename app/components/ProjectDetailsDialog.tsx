"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../component/ui/dialog";
import { Badge } from "../../component/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../component/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../component/ui/card";
import { Progress } from "../../component/ui/progress";
import { Separator } from "../../component/ui/separator";
import { 
  Calendar, 
  DollarSign, 
  User, 
  Clock, 
  Flag,
  Target,
  TrendingUp
} from "lucide-react";

interface ProjectEntry {
  id: string;
  name: string;
  status: string;
  priority: string;
  assignee: {
    name: string;
    avatar: string;
    email: string;
  };
  progress: number;
  deadline: string;
  budget: string;
  createdAt: string;
}

interface ProjectDetailsDialogProps {
  project: ProjectEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400";
    case "In Progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400";
    case "Medium":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400";
    case "Low":
      return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

export function ProjectDetailsDialog({ 
  project, 
  open, 
  onOpenChange 
}: ProjectDetailsDialogProps) {
  if (!project) return null;

  const daysUntilDeadline = Math.ceil(
    (new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysSinceCreated = Math.ceil(
    (new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Target className="h-5 w-5" />
            Project Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Header */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-semibold break-words">{project.name}</h2>
                <p className="text-muted-foreground">{project.id}</p>
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Badge variant="secondary" className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <Badge variant="secondary" className={getPriorityColor(project.priority)}>
                  {project.priority}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Project Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.progress}%</div>
                <Progress value={project.progress} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.budget}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total allocated
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Days Left</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${daysUntilDeadline < 7 ? 'text-red-600' : ''}`}>
                  {daysUntilDeadline > 0 ? daysUntilDeadline : 'Overdue'}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Until deadline
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignee Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assigned To
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/avatar-${project.assignee.avatar.toLowerCase()}.jpg`} />
                    <AvatarFallback>{project.assignee.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.assignee.name}</p>
                    <p className="text-sm text-muted-foreground">{project.assignee.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(project.createdAt).toLocaleDateString()} 
                    <span className="text-muted-foreground ml-1">
                      ({daysSinceCreated} days ago)
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Deadline</span>
                  <span className={`text-sm font-medium ${daysUntilDeadline < 7 ? 'text-red-600' : ''}`}>
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <div className="flex items-center gap-2">
                    <Flag className={`h-3 w-3 ${
                      project.priority === 'High' ? 'text-red-500' :
                      project.priority === 'Medium' ? 'text-orange-500' : 'text-green-500'
                    }`} />
                    <span className="text-sm font-medium">{project.priority}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This project involves comprehensive development and implementation of key features 
                to improve user experience and business outcomes. The project scope includes 
                research, design, development, testing, and deployment phases with regular 
                milestone reviews and stakeholder updates.
              </p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Progress updated to {project.progress}%</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Task completed: Initial wireframes</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-orange-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Meeting scheduled with stakeholders</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}