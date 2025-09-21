"use client"
import { useState, useEffect } from "react";

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

export function useRealTimeData() {
  const [entries, setEntries] = useState(initialEntries);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const updateProject = (updatedProject: typeof initialEntries[0]) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === updatedProject.id ? updatedProject : entry
      )
    );
    setLastUpdated(new Date());
  };

  const updateData = () => {
    setEntries(prevEntries => {
      const updatedEntries = [...prevEntries];
      
      // Simulate random updates
      const randomUpdates = [
        // Progress updates
        () => {
          const inProgressProjects = updatedEntries.filter(e => e.status === "In Progress");
          if (inProgressProjects.length > 0) {
            const project = inProgressProjects[Math.floor(Math.random() * inProgressProjects.length)];
            const index = updatedEntries.findIndex(e => e.id === project.id);
            if (index !== -1 && updatedEntries[index].progress < 100) {
              updatedEntries[index] = {
                ...updatedEntries[index],
                progress: Math.min(100, updatedEntries[index].progress + Math.floor(Math.random() * 15) + 5)
              };
            }
          }
        },
        // Status changes
        () => {
          const pendingProjects = updatedEntries.filter(e => e.status === "Pending");
          if (pendingProjects.length > 0) {
            const project = pendingProjects[Math.floor(Math.random() * pendingProjects.length)];
            const index = updatedEntries.findIndex(e => e.id === project.id);
            if (index !== -1) {
              updatedEntries[index] = {
                ...updatedEntries[index],
                status: "In Progress",
                progress: Math.max(updatedEntries[index].progress, 10)
              };
            }
          }
        },
        // Complete projects
        () => {
          const nearCompleteProjects = updatedEntries.filter(e => e.status === "In Progress" && e.progress >= 90);
          if (nearCompleteProjects.length > 0) {
            const project = nearCompleteProjects[Math.floor(Math.random() * nearCompleteProjects.length)];
            const index = updatedEntries.findIndex(e => e.id === project.id);
            if (index !== -1) {
              updatedEntries[index] = {
                ...updatedEntries[index],
                status: "Completed",
                progress: 100
              };
            }
          }
        },
        // Budget updates
        () => {
          const activeProjects = updatedEntries.filter(e => e.status === "In Progress");
          if (activeProjects.length > 0) {
            const project = activeProjects[Math.floor(Math.random() * activeProjects.length)];
            const index = updatedEntries.findIndex(e => e.id === project.id);
            if (index !== -1) {
              const currentBudget = parseInt(updatedEntries[index].budget.replace(/[$,]/g, ""));
              const change = Math.floor(Math.random() * 10000) - 5000; // -$5k to +$5k
              const newBudget = Math.max(5000, currentBudget + change);
              updatedEntries[index] = {
                ...updatedEntries[index],
                budget: `$${newBudget.toLocaleString()}`
              };
            }
          }
        }
      ];

      // Execute a random update
      const randomUpdate = randomUpdates[Math.floor(Math.random() * randomUpdates.length)];
      randomUpdate();

      return updatedEntries;
    });
    
    setLastUpdated(new Date());
  };

  // Auto-update every 30 seconds
  useEffect(() => {
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    entries,
    lastUpdated,
    updateData,
    updateProject
  };
}