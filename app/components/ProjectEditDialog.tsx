"use client"
import { useState, useEffect } from "react";
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

const teamMembers = [
  { name: "Sarah Johnson", avatar: "SJ", email: "sarah@company.com" },
  { name: "Mike Chen", avatar: "MC", email: "mike@company.com" },
  { name: "Emily Davis", avatar: "ED", email: "emily@company.com" },
  { name: "Alex Thompson", avatar: "AT", email: "alex@company.com" },
  { name: "Lisa Wang", avatar: "LW", email: "lisa@company.com" },
  { name: "John Smith", avatar: "JS", email: "john@company.com" },
  { name: "Maria Garcia", avatar: "MG", email: "maria@company.com" },
];

export function ProjectEditDialog({ 
  project, 
  open, 
  onOpenChange, 
  onSave 
}: ProjectEditDialogProps) {
  const [formData, setFormData] = useState<ProjectEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (project && open) {
      setFormData({ ...project });
    }
  }, [project, open]);

  if (!formData) return null;

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      onSave(formData);
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
                defaultValue="This project involves comprehensive development and implementation of key features to improve user experience and business outcomes."
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
          <div>
            <Label htmlFor="assignee">Assigned To</Label>
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
                {teamMembers.map((member) => (
                  <SelectItem key={member.email} value={member.email}>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                        {member.avatar}
                      </div>
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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