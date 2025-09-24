import { Skeleton } from "../../component/ui/skeleton";
import { EnhancedEntriesTable } from "./EnhancedEntriesTable";
import { useRealTimeData } from "./RealTimeUpdates";

export function ProjectTable() {
  const { entries, loading, error, updateData } = useRealTimeData();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        {error}
        <button onClick={updateData} className="ml-2 underline text-blue-600">
          Retry
        </button>
      </div>
    );
  }

  return (
    <EnhancedEntriesTable entries={entries} onRefresh={updateData} onProjectUpdate={updateProject} />
  );
}
