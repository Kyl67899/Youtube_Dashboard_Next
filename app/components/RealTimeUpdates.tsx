"use client";
import { useState, useEffect } from "react";
import { initialEntries } from "../data/initialEntries";

const LOCAL_STORAGE_KEY = "project-entries";

export function useRealTimeData() {
  const [entries, setEntries] = useState<typeof initialEntries>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      } else {
        setEntries(initialEntries);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialEntries));
      }
    } catch (err) {
      setError("Failed to load project data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, loading]);

  const updateProject = (updatedProject: typeof initialEntries[0]) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === updatedProject.id ? updatedProject : entry
      )
    );
    setLastUpdated(new Date());
  };

  const updateData = () => {
    try {
      setEntries(prevEntries => {
        const updatedEntries = [...prevEntries];

        const randomUpdates = [
          () => {
            const inProgress = updatedEntries.filter(e => e.status === "In Progress");
            if (inProgress.length > 0) {
              const project = inProgress[Math.floor(Math.random() * inProgress.length)];
              const index = updatedEntries.findIndex(e => e.id === project.id);
              if (index !== -1 && updatedEntries[index].progress < 100) {
                updatedEntries[index] = {
                  ...updatedEntries[index],
                  progress: Math.min(100, updatedEntries[index].progress + Math.floor(Math.random() * 15) + 5)
                };
              }
            }
          },
          () => {
            const pending = updatedEntries.filter(e => e.status === "Pending");
            if (pending.length > 0) {
              const project = pending[Math.floor(Math.random() * pending.length)];
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
          () => {
            const nearComplete = updatedEntries.filter(e => e.status === "In Progress" && e.progress >= 90);
            if (nearComplete.length > 0) {
              const project = nearComplete[Math.floor(Math.random() * nearComplete.length)];
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
          () => {
            const active = updatedEntries.filter(e => e.status === "In Progress");
            if (active.length > 0) {
              const project = active[Math.floor(Math.random() * active.length)];
              const index = updatedEntries.findIndex(e => e.id === project.id);
              if (index !== -1) {
                const currentBudget = parseInt(updatedEntries[index].budget.replace(/[$,]/g, ""));
                const change = Math.floor(Math.random() * 10000) - 5000;
                const newBudget = Math.max(5000, currentBudget + change);
                updatedEntries[index] = {
                  ...updatedEntries[index],
                  budget: `$${newBudget.toLocaleString()}`
                };
              }
            }
          }
        ];

        const randomUpdate = randomUpdates[Math.floor(Math.random() * randomUpdates.length)];
        randomUpdate();

        return updatedEntries;
      });

      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to update project data.");
    }
  };

  return {
    entries,
    loading,
    error,
    lastUpdated,
    updateData,
    updateProject
  };
}
