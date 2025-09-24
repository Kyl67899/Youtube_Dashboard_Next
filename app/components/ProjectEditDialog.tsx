"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../component/ui/dialog";
import { Button } from "../../component/ui/button";
import { Input } from "../../component/ui/input";
import { Label } from "../../component/ui/label";
import { Textarea } from "../../component/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../component/ui/select";
import { Slider } from "../../component/ui/slider";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";

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

interface ProjectEditDialogProps {
  project: ProjectEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedProject: ProjectEntry) => void;
}

type TeamMember = {
  name: string;
  email: string;
  avatar: string;
};

const initialTeam = [
  { name: "Sarah Johnson", avatar: "SJ", email: "sarah@company.com" },
  { name: "Mike Chen", avatar: "MC", email: "mike@company.com" },
  { name: "Emily Davis", avatar: "ED", email: "emily@company.com" },
  { name: "Alex Thompson", avatar: "AT", email: "alex@company.com" },
  { name: "Lisa Wang", avatar: "LW", email: "lisa@company.com" },
  { name: "John Smith", avatar: "JS", email: "john@company.com" },
  { name: "Maria Garcia", avatar: "MG", email: "maria@company.com" },
];

const TEAM_STORAGE_KEY = "project-team-members";

export function ProjectEditDialog({
  project,
  open,
  onOpenChange,
  onSave
}: ProjectEditDialogProps) {
  const [formData, setFormData] = useState<ProjectEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState<typeof initialTeam[]>([]);
  const [newMember, setNewMember] = useState({ name: "", email: "", avatar: "" });
  const [description, setDescription] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("project-description");
    if (stored) setDescription(stored);
  }, []);  

  useEffect(() => {
    const syncTeam = (e: StorageEvent) => {
      if (e.key === TEAM_STORAGE_KEY && e.newValue) {
        setTeamMembers(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", syncTeam);
    return () => window.removeEventListener("storage", syncTeam);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(TEAM_STORAGE_KEY);
    if (stored) {
      setTeamMembers(JSON.parse(stored));
    } else {
      setTeamMembers(initialTeam);
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(initialTeam));
    }
  }, []);

  useEffect(() => {
    if (project && open) {
      setFormData({ ...project });
    }
  }, [project, open]);

  // sync across tabs
  useEffect(() => {
    const syncTeam = (e: StorageEvent) => {
      if (e.key === TEAM_STORAGE_KEY && e.newValue) {
        setTeamMembers(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", syncTeam);
    return () => window.removeEventListener("storage", syncTeam);
  }, []);

  // For editing team members
  const handleAddMember = () => {
    // basic validation
    if (!newMember.name || !newMember.email || !newMember.avatar) {
      toast.error("All fields are required");
      return;
    }

    // check for duplicate email
    const existingEmail = teamMembers.some(member => member.email === newMember.email);
    if (existingEmail) {
      toast.error("A team member with this email already exists");
      return;
    }

    // updating team member
    const updatedTeam = [...teamMembers, newMember];
    setTeamMembers(updatedTeam);
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedTeam));
    toast.success("Team member added");
    setNewMember({ name: "", email: "", avatar: "" });
  };

  if (!formData) return null

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      onSave(formData); // updates parent state

      // Update localStorage
      const stored = localStorage.getItem("project-entries");
      const entries = stored ? JSON.parse(stored) : [];
      const updatedEntries = entries.map((entry: ProjectEntry) =>
        entry.id === formData.id ? formData : entry
      );
      localStorage.setItem("project-entries", JSON.stringify(updatedEntries));

      localStorage.setItem("project-last-updated", new Date().toISOString());

      toast.success("Project updated successfully!", {
        description: `${formData.name} has been updated.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update project", {
        description: "Please try again later.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(project);
    onOpenChange(false);
  };

  const formatBudgetInput = (value: string) => {
    // Remove non-numeric characters except comma and period
    const numericValue = value.replace(/[^0-9.,]/g, '');

    // Convert to number and format
    const number = parseFloat(numericValue.replace(/,/g, ''));
    if (isNaN(number)) return '';

    return `$${number.toLocaleString()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project description"
                className="min-h-[100px]"
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescription(value);
                  localStorage.setItem("project-description", value); // Save to localStorage
                }}
                onBlur={(e) => {
                  localStorage.setItem("project-description", e.target.value);
                }}                
              />
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Progress */}
          <div>
            <Label htmlFor="progress">Progress: {formData.progress}%</Label>
            <div className="mt-2">
              <Slider
                value={[formData.progress]}
                onValueChange={(value) => setFormData({ ...formData, progress: value[0] })}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Assignee */}
          {/* <div>
            <Label htmlFor="assignee">Assigned To</Label>
            <Input
              placeholder="Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
            <Select
              value={formData.assignee.email}
              onValueChange={(value) => {
                const selectedMember = teamMembers.find(member => member.email === value);
                if (selectedMember) {
                  setFormData({
                    ...formData,
                    assignee: selectedMember
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member, index) => (
                  <div key={member.email} className="flex items-center gap-4">
                    {editingIndex === index ? (
                      <>
                        <Input
                          value={member.name}
                          onChange={(e) => {
                            const updated = [...teamMembers];
                            updated[index].name = e.target.value;
                            setTeamMembers(updated);
                          }}
                        />
                        <Input
                          value={member.email}
                          onChange={(e) => {
                            const updated = [...teamMembers];
                            updated[index].email = e.target.value;
                            setTeamMembers(updated);
                          }}
                        />
                        <Input
                          value={member.avatar}
                          onChange={(e) => {
                            const updated = [...teamMembers];
                            updated[index].avatar = e.target.value;
                            setTeamMembers(updated);
                          }}
                        />
                        <Button
                          onClick={() => {
                            localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamMembers));
                            toast.success("Member updated");
                            setEditingIndex(null);
                          }}
                        >
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditingIndex(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-sm">{member.name}</div>
                        <div className="text-sm">{member.email}</div>
                        <div className="text-sm">{member.avatar}</div>
                        <Button variant="ghost" onClick={() => setEditingIndex(index)}>Edit</Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            const updated = teamMembers.filter((_, i) => i !== index);
                            setTeamMembers(updated);
                            localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updated));
                            toast.success("Member deleted");
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          <div className="mt-4 space-y-2">
            <Label>Add New Assignee</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
              <Input
                placeholder="Initials"
                value={newMember.avatar}
                onChange={(e) => setNewMember({ ...newMember, avatar: e.target.value })}
              />
            </div>
            <Button
              className="mt-2"
              onClick={() => {
                if (!newMember.name || !newMember.email || !newMember.avatar) {
                  toast.error("All fields are required");
                  return;
                }

                const duplicate = teamMembers.some(m => m.email === newMember.email);
                if (duplicate) {
                  toast.error("Email already exists");
                  return;
                }

                const updatedTeam = [...teamMembers, newMember];
                setTeamMembers(updatedTeam);
                localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedTeam));
                toast.success("New assignee added");
                setNewMember({ name: "", email: "", avatar: "" });

                setFormData({
                  ...formData,
                  assignee: newMember
                });
              }}
            >
              Add Assignee
            </Button>
          </div>

          {/* Budget and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({
                  ...formData,
                  budget: formatBudgetInput(e.target.value)
                })}
                placeholder="$0"
              />
            </div>

            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}