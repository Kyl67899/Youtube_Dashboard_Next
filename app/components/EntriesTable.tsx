import { Card, CardContent, CardHeader, CardTitle } from "../component/ui/card";
import { Badge } from "../component/ui/badge";
import { Button } from "../component/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../component/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../component/ui/avatar";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../component/ui/dropdown-menu";

const entries = [
  {
    id: "PRJ-001",
    name: "E-commerce Redesign",
    status: "In Progress",
    priority: "High",
    assignee: {
      name: "Sarah Johnson",
      avatar: "SJ",
      email: "sarah@company.com"
    },
    progress: 75,
    deadline: "2024-01-15",
    budget: "$25,000"
  },
  {
    id: "PRJ-002",
    name: "Mobile App Development",
    status: "Completed",
    priority: "Medium",
    assignee: {
      name: "Mike Chen",
      avatar: "MC",
      email: "mike@company.com"
    },
    progress: 100,
    deadline: "2024-01-10",
    budget: "$45,000"
  },
  {
    id: "PRJ-003",
    name: "Brand Identity Update",
    status: "Pending",
    priority: "Low",
    assignee: {
      name: "Emily Davis",
      avatar: "ED",
      email: "emily@company.com"
    },
    progress: 25,
    deadline: "2024-02-01",
    budget: "$15,000"
  },
  {
    id: "PRJ-004",
    name: "API Integration",
    status: "In Progress",
    priority: "High",
    assignee: {
      name: "Alex Thompson",
      avatar: "AT",
      email: "alex@company.com"
    },
    progress: 60,
    deadline: "2024-01-20",
    budget: "$30,000"
  },
  {
    id: "PRJ-005",
    name: "User Research Study",
    status: "In Progress",
    priority: "Medium",
    assignee: {
      name: "Lisa Wang",
      avatar: "LW",
      email: "lisa@company.com"
    },
    progress: 40,
    deadline: "2024-01-25",
    budget: "$12,000"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "In Progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "Medium":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    case "Low":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export function EntriesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-sm text-muted-foreground">{entry.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(entry.status)}>
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getPriorityColor(entry.priority)}>
                    {entry.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/avatar-${entry.assignee.avatar.toLowerCase()}.jpg`} />
                      <AvatarFallback>{entry.assignee.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{entry.assignee.name}</div>
                      <div className="text-xs text-muted-foreground">{entry.assignee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${entry.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">{entry.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{entry.deadline}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{entry.budget}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit project
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}