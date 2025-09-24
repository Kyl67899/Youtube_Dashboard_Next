"use client"

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../component/ui/dialog";
import { Input } from "../../component/ui/input";
import { Button } from "../../component/ui/button";
import { Plus } from "lucide-react";
import { Project } from "../data/types";
import { ProjectEditDialog } from "./ProjectEditDialog";
import { Textarea } from "@/component/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/component/ui/select";
import { ScrollArea } from "@/component/ui/scroll-area";
import { Label } from "@/component/ui/label";
import { Slider } from "@/component/ui/slider";

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

export function NewProjectDialog({ onAdd }: { onAdd: (project: typeof Project) => void }) {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [lastSubmitted, setLastSubmitted] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);

    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Pending");
    const [priority, setPriority] = useState("Medium");
    const [assignees, setAssignees] = useState<TeamMember[]>([]);
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("2024-12-31");

    const handleAdd = () => {
        const now = Date.now();
        if (lastSubmitted && now - lastSubmitted < 5000) {
            setError("Please wait before submitting again.");
            return;
        }

        setLastSubmitted(now);
        const trimmedName = name.trim();

        if (trimmedName.length < 3) {
            setError("Project name must be at least 3 characters.");
            return;
        }

        if (trimmedName.length > 100) {
            setError("Project name must be under 100 characters.");
            return;
        }

        if (!/^[a-zA-Z0-9\s\-_,.()]+$/.test(trimmedName)) {
            setError("Project name contains invalid characters.");
            return;
        }

        // Clear error and proceed
        setError("");
        const newProject = {
            id: `PRJ-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
            name: trimmedName,
            status,
            priority,
            assignees,
            progress,
            deadline,
            budget,
            description,
            createdAt: new Date().toISOString().split("T")[0],
        };
        onAdd(newProject);
        setName("");
        setOpen(false);

        const stored = localStorage.getItem("project-entries");
        const entries = stored ? JSON.parse(stored) : [];
        entries.push(newProject);
        localStorage.setItem("project-entries", JSON.stringify(entries));
    };

    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("team-members");
        if (stored) {
            setTeamMembers(JSON.parse(stored));
        } else {
            const defaultTeam = [
                { name: "Alice", email: "alice@example.com", avatar: "A" },
                { name: "Bob", email: "bob@example.com", avatar: "B" },
            ];
            setTeamMembers(defaultTeam);
            localStorage.setItem("team-members", JSON.stringify(defaultTeam));
        }
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="hidden sm:flex">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">New Project</span>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <Input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />

                <Label htmlFor="progress">Progress: {progress}%</Label>
                <div className="mt-2">
                    <Slider
                        value={[progress]}
                        onValueChange={(value) => setProgress(value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                    />
                </div>

                <Textarea
                    placeholder="Project description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                />

                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>

                {/* Assignee Multi-Select */}
                <Select onValueChange={(email) => {
                    const selected = teamMembers.find(m => m.email === email);
                    if (selected && !assignees.some(a => a.email === email)) {
                        setAssignees([...assignees, selected]);
                    }
                }}>
                    <SelectTrigger><SelectValue placeholder="Add Assignee" /></SelectTrigger>
                    <SelectContent>
                        {teamMembers.map((member) => (
                            <SelectItem key={member.email} value={member.email}>
                                {member.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <ScrollArea className="flex gap-2 overflow-x-auto py-2">
                    {assignees.map((a) => (
                        <div key={a.email} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-2">
                            {a.name}
                            <Button variant="ghost" size="icon" onClick={() => setAssignees(assignees.filter(x => x.email !== a.email))}>✕</Button>
                        </div>
                    ))}
                </ScrollArea>

                <Input
                    placeholder="Budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                />

                <Input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} disabled={!name || !!error}>
                        Add Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
