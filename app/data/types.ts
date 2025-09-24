// types.ts or at the top of your file
export type Project = {
  id: string;
  name: string;
  status: "Completed" | "In Progress" | "Pending";
  priority: "High" | "Medium" | "Low";
  assignee: {
    name: string;
    avatar: string;
    email: string;
  };
  progress: number;
  deadline: string;
  budget: string;
  createdAt: string;
};

export const Project = [
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
];
