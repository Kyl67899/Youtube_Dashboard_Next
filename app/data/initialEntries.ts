import { Project } from './types';

export const initialEntries: Project[] = [
  {
    id: "PRJ-001",
    name: "Sample Project",
    status: "Pending",
    priority: "Medium",
    assignee: {
      name: "John Doe",
      avatar: "JD",
      email: "john@example.com"
    },
    progress: 0,
    deadline: "2025-10-01",
    budget: "$10,000",
    createdAt: new Date().toISOString()
  }
];
export { Project };

