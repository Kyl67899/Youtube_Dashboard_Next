'use client'

import { ThemeProvider } from "./components/ThemeProvider"
import { NavBar } from "./components/NavBar"
import { HeroPanel } from "./components/HeroPanel"
import { SummaryCards } from "./components/SummaryCards"
import { EnhancedEntriesTable } from "./components/EnhancedEntriesTable"
import { NotificationSystem } from "./components/NotificationSystem"
import { useRealTimeData } from "./components/RealTimeUpdates"

export default function Home() {
  const { entries, lastUpdated, updateData, updateProject } =
    useRealTimeData();

  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="dashboard-theme"
    >
      <div className="min-h-screen bg-background">
        <NavBar />

        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          <HeroPanel />
          <SummaryCards />
          <EnhancedEntriesTable
            entries={entries}
            onRefresh={updateData}
            onProjectUpdate={updateProject}
          />

          <div className="text-center text-sm text-muted-foreground px-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </main>

        <NotificationSystem onDataUpdate={updateData} />
        {/* <Toaster /> */}
      </div>
    </ThemeProvider>
  );
}

