import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type Report = {
  id: string;
  title: string;
  type: string;
  description: string;
  reported_by: string;
  location: string;
  priority: string;
  status: string;
  date: string;
  created_at: string;
  updated_at: string;
};

const Reports = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    reported_by: "",
    location: "",
    priority: "",
    status: "Pending",
  });

  // Fetch reports
  const { data: reports = [] } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data as Report[];
    },
  });

  // Add report mutation
  const addReportMutation = useMutation({
    mutationFn: async (newReport: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('reports')
        .insert([newReport])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "Report created",
        description: "The report has been submitted successfully.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update report mutation
  const updateReportMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Report> & { id: string }) => {
      const { data, error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "Report updated",
        description: "The report has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      setSelectedReport(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete report mutation
  const deleteReportMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "Report deleted",
        description: "The report has been removed successfully.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedReport(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      description: "",
      reported_by: "",
      location: "",
      priority: "",
      status: "Pending",
    });
  };

  const getPriorityBadgeStyle = (priority: string) => {
    if (priority === "High") {
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    }
    if (priority === "Medium") {
      return "bg-secondary text-secondary-foreground hover:bg-secondary/90";
    }
    if (priority === "Low") {
      return "bg-muted text-muted-foreground hover:bg-muted/90";
    }
    return "bg-muted text-muted-foreground hover:bg-muted/90";
  };

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Pending") {
      return "bg-accent text-accent-foreground hover:bg-accent/90";
    }
    if (status === "Closed") {
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    }
    if (status === "In Progress") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    return "bg-muted text-muted-foreground hover:bg-muted/90";
  };

  const cycleStatus = (currentStatus: string) => {
    const statuses = ["Pending", "In Progress", "Closed"];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  const handleStatusClick = (report: Report) => {
    const newStatus = cycleStatus(report.status);
    updateReportMutation.mutate({ id: report.id, status: newStatus });
  };

  const handleEdit = (report: Report) => {
    setSelectedReport(report);
    setFormData({
      title: report.title,
      type: report.type,
      description: report.description,
      reported_by: report.reported_by,
      location: report.location,
      priority: report.priority,
      status: report.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (report: Report) => {
    setSelectedReport(report);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReport) {
      deleteReportMutation.mutate(selectedReport.id);
    }
  };

  const handleAddSubmit = () => {
    if (!formData.title || !formData.type || !formData.description || !formData.reported_by || !formData.location || !formData.priority) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addReportMutation.mutate({
      title: formData.title,
      type: formData.type,
      description: formData.description,
      reported_by: formData.reported_by,
      location: formData.location,
      priority: formData.priority,
      status: formData.status,
      date: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const handleEditSubmit = () => {
    if (!selectedReport) return;
    
    if (!formData.title || !formData.type || !formData.description || !formData.reported_by || !formData.location || !formData.priority) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    updateReportMutation.mutate({
      id: selectedReport.id,
      title: formData.title,
      type: formData.type,
      description: formData.description,
      reported_by: formData.reported_by,
      location: formData.location,
      priority: formData.priority,
      status: formData.status,
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MM/dd/yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
          Reports
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage barangay incident reports and complaints
        </p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Report</DialogTitle>
              <DialogDescription>
                Enter the report information. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Brief description of the incident"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Concern">Concern</SelectItem>
                    <SelectItem value="Complaint">Complaint</SelectItem>
                    <SelectItem value="Incident">Incident</SelectItem>
                    <SelectItem value="Maintenance Request">Maintenance Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detailed description of the report..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reportedBy">Reported By</Label>
                <Input 
                  id="reportedBy" 
                  placeholder="Name of reporter"
                  value={formData.reported_by}
                  onChange={(e) => setFormData({...formData, reported_by: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Location of incident"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90" 
                onClick={handleAddSubmit}
                disabled={addReportMutation.isPending}
              >
                {addReportMutation.isPending ? "Saving..." : "Save Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reports Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">All Reports</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Reported By</TableHead>
              <TableHead className="font-medium">Location</TableHead>
              <TableHead className="font-medium">Priority</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Date</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No reports found. Create your first report to get started.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="max-w-xs">
                    <div className="font-medium">{report.title}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-secondary">{report.type}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{report.reported_by}</TableCell>
                  <TableCell className="text-muted-foreground">{report.location}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadgeStyle(report.priority)}>
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getStatusBadgeStyle(report.status)} cursor-pointer`}
                      onClick={() => handleStatusClick(report)}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(report.date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEdit(report)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(report)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Report</DialogTitle>
            <DialogDescription>
              Update the report information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Concern">Concern</SelectItem>
                  <SelectItem value="Complaint">Complaint</SelectItem>
                  <SelectItem value="Incident">Incident</SelectItem>
                  <SelectItem value="Maintenance Request">Maintenance Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-reportedBy">Reported By</Label>
              <Input 
                id="edit-reportedBy" 
                value={formData.reported_by}
                onChange={(e) => setFormData({...formData, reported_by: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input 
                id="edit-location" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger id="edit-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedReport(null); }}>
              Cancel
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              onClick={handleEditSubmit}
              disabled={updateReportMutation.isPending}
            >
              {updateReportMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteReportMutation.isPending}
            >
              {deleteReportMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Reports;
