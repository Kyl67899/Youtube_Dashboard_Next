export default function ProjectPage() {
    const [projects, setProjects] = useState<ProjectEntry[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);
    const [filters, setFilters] = useState({ status: "All", priority: "All", assignee: "All" });
  
    useEffect(() => {
      const stored = localStorage.getItem("project-entries");
      if (stored) setProjects(JSON.parse(stored));
    }, []);

    const filteredProjects = projects.filter(p =>
        (filters.status === "All" || p.status === filters.status) &&
        (filters.priority === "All" || p.priority === filters.priority)
      );

      const saveChangeLog = (projectId: string) => {
        const updated = projects.map(p => {
          if (p.id === projectId) {
            const logs = p.logs || [];
            logs.push({ entry: changeLog, timestamp: new Date().toISOString() });
            return { ...p, logs };
          }
          return p;
        });
        setProjects(updated);
        localStorage.setItem("project-entries", JSON.stringify(updated));
        setChangeLog("");
      };
      
    
    return(
        <div className="flex gap-4 mb-4">
  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="All">All</SelectItem>
      <SelectItem value="Pending">Pending</SelectItem>
      <SelectItem value="In Progress">In Progress</SelectItem>
      <SelectItem value="Completed">Completed</SelectItem>
    </SelectContent>
  </Select>

  <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
    <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="All">All</SelectItem>
      <SelectItem value="Low">Low</SelectItem>
      <SelectItem value="Medium">Medium</SelectItem>
      <SelectItem value="High">High</SelectItem>
    </SelectContent>
  </Select>
</div>
  
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Project</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Priority</TableHead>
        <TableHead>Progress</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {filteredProjects.map((project) => (
        <TableRow key={project.id} onClick={() => setSelectedProject(project)}>
          <TableCell>{project.name}</TableCell>
          <TableCell>{project.status}</TableCell>
          <TableCell>{project.priority}</TableCell>
          <TableCell>{project.progress}%</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

{selectedProject && (
    <Dialog open={true} onOpenChange={() => setSelectedProject(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedProject.name}</DialogTitle>
        </DialogHeader>
  
        <p className="text-muted-foreground whitespace-pre-line">{selectedProject.description}</p>
  
        {selectedProject.assignees.some(a => a.email === currentUser.email) && (
          <>
            <Button onClick={() => handleEdit(selectedProject)}>Edit</Button>
            <Button variant="destructive" onClick={() => handleDelete(selectedProject.id)}>Delete</Button>
  
            <Textarea
              placeholder="Add change log entry"
              value={changeLog}
              onChange={(e) => setChangeLog(e.target.value)}
            />
            <Button onClick={() => saveChangeLog(selectedProject.id)}>Save Log</Button>
          </>
        )}
  
        <ScrollArea className="max-h-64 mt-4">
          {selectedProject.logs?.map((log, i) => (
            <div key={i} className="text-sm text-muted-foreground">
              {log.entry} — {new Date(log.timestamp).toLocaleString()}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )}
  
  

    )