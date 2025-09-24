"use client"
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../component/ui/card";
import { Badge } from "../../component/ui/badge";
import { Button } from "../../component/ui/button";
import { Input } from "../../component/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../component/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../component/ui/table";
import { ScrollArea } from "../../component/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../component/ui/avatar";
import { Progress } from "../../component/ui/progress";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  DollarSign,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../component/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../component/ui/alert-dialog";
import { ProjectDetailsDialog } from "./ProjectDetailsDialog";
import { ProjectEditDialog } from "./ProjectEditDialog";
import { toast } from "sonner";
import { Project } from "../data/types";

const initialEntries = [
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
    budget: "$25,000",
    createdAt: "2023-12-01"
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
    budget: "$45,000",
    createdAt: "2023-11-15"
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
    budget: "$15,000",
    createdAt: "2023-12-10"
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
    budget: "$30,000",
    createdAt: "2023-11-20"
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
    budget: "$12,000",
    createdAt: "2023-12-05"
  }
];

type SortKey = "name" | "status" | "priority" | "progress" | "deadline" | "budget";
type SortOrder = "asc" | "desc";

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

interface EnhancedEntriesTableProps {
  entries: Project[];
  onRefresh: () => void;
  onProjectUpdate: (updatedProject: Project) => void;
}

export function EnhancedEntriesTable({ onRefresh, onProjectUpdate }: EnhancedEntriesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Dialog states
  const [selectedProject, setSelectedProject] = useState<typeof entries[0] | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [entries, setEntries] = useState(initialEntries);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<typeof entries[0] | null>(null);

  useEffect(() => {
    localStorage.setItem("project-entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const stored = localStorage.getItem("project-entries");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);


  const filteredAndSortedEntries = useMemo(() => {
    const filtered = entries.filter((entry) => {
      const matchesSearch =
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.assignee.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || entry.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortKey) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "priority":
          const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case "progress":
          aValue = a.progress;
          bValue = b.progress;
          break;
        case "deadline":
          aValue = new Date(a.deadline).getTime();
          bValue = new Date(b.deadline).getTime();
          break;
        case "budget":
          aValue = parseInt(a.budget.replace(/[$,]/g, ""));
          bValue = parseInt(b.budget.replace(/[$,]/g, ""));
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [entries, searchTerm, statusFilter, priorityFilter, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleViewDetails = (project: typeof entries[0]) => {
    setSelectedProject(project);
    setDetailsDialogOpen(true);
  };

  const handleEditProject = (project: typeof entries[0]) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };

  const handleDeleteProject = (project: typeof entries[0]) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== projectToDelete.id)
      );

      toast.success("Project deleted", {
        description: `${projectToDelete.name} has been deleted successfully.`,
      });

      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  // const handleSaveProject = (updatedProject: typeof entries[0]) => {
  //   onProjectUpdate(updatedProject);
  // };

  const handleSaveProject = (updatedProject: Project) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === updatedProject.id ? updatedProject : entry))
    );
    toast.success("Project updated", {
      description: `${updatedProject.name} has been updated.`,
    });
    setEditDialogOpen(false);
  };

  const SortableHeader = ({ sortKey: key, children }: { sortKey: SortKey, children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => handleSort(key)}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Projects</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredAndSortedEntries.length} of {entries.length} projects
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <ScrollArea className="h-[600px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader sortKey="name">Name</SortableHeader>
                  <SortableHeader sortKey="status">Status</SortableHeader>
                  <SortableHeader sortKey="priority">Priority</SortableHeader>
                  <SortableHeader sortKey="progress">Progress</SortableHeader>
                  <SortableHeader sortKey="deadline">Deadline</SortableHeader>
                  <SortableHeader sortKey="budget">Budget</SortableHeader>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(entry.priority)}>{entry.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={entry.progress} />
                    </TableCell>
                    <TableCell>{entry.deadline}</TableCell>
                    <TableCell>{entry.budget}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleViewDetails(entry)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProject(entry)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteProject(entry)}>
                            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredAndSortedEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Header with title and action menu */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{entry.name}</h3>
                      <p className="text-sm text-muted-foreground">{entry.id}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(entry)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProject(entry)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit project
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteProject(entry)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Status and Priority badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                    <Badge variant="secondary" className={getPriorityColor(entry.priority)}>
                      {entry.priority}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{entry.progress}%</span>
                    </div>
                    <Progress value={entry.progress} className="h-2" />
                  </div>

                  {/* Assignee */}
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={`/avatar-${entry.assignee.avatar.toLowerCase()}.jpg`} />
                        <AvatarFallback className="text-xs">{entry.assignee.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{entry.assignee.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{entry.assignee.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Deadline and Budget */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Deadline</p>
                        <p className="font-medium">{entry.deadline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{entry.budget}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedEntries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No projects found matching your criteria.
          </div>
        )}
      </CardContent>

      {/* Project Details Dialog */}
      <ProjectDetailsDialog
        project={selectedProject}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      {/* Project Edit Dialog */}
      <ProjectEditDialog
        project={selectedProject}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveProject}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              &quot;{projectToDelete?.name}&quot; and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}