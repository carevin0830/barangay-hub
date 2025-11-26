import { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
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

const initialReports = [
  {
    id: 1,
    title: "Barangay Anti-Drugs Abuse Council (BADAC) FUNCTIONALITY",
    type: "Concern",
    reportedBy: "CATHERINE A. DUMLAO",
    location: "POBLACION",
    priority: "Medium",
    status: "Pending",
    date: "11/26/2025",
  },
  {
    id: 2,
    title: "test",
    type: "Concern",
    reportedBy: "test",
    location: "test",
    priority: "Low",
    status: "Closed",
    date: "10/6/2025",
  },
  {
    id: 3,
    title: "test",
    type: "Complaint",
    reportedBy: "test",
    location: "test",
    priority: "High",
    status: "Closed",
    date: "10/2/2025",
  },
];

const Reports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState(initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof initialReports[0] | null>(null);

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

  const handleEdit = (report: typeof initialReports[0]) => {
    setSelectedReport(report);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (report: typeof initialReports[0]) => {
    setSelectedReport(report);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReport) {
      setReports(reports.filter(r => r.id !== selectedReport.id));
      toast({
        title: "Report deleted",
        description: `${selectedReport.title} has been removed.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedReport(null);
    }
  };

  const saveEdit = () => {
    if (selectedReport) {
      setReports(reports.map(r => 
        r.id === selectedReport.id ? selectedReport : r
      ));
      toast({
        title: "Report updated",
        description: `${selectedReport.title} has been updated.`,
      });
      setIsEditDialogOpen(false);
      setSelectedReport(null);
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
                <Input id="title" placeholder="Brief description of the incident" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concern">Concern</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="maintenance">Maintenance Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detailed description of the report..."
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reportedBy">Reported By</Label>
                <Input id="reportedBy" placeholder="Name of reporter" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Location of incident" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90">Save Report</Button>
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
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="max-w-xs">
                  <div className="font-medium">{report.title}</div>
                </TableCell>
                <TableCell>
                  <span className="text-secondary">{report.type}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{report.reportedBy}</TableCell>
                <TableCell className="text-muted-foreground">{report.location}</TableCell>
                <TableCell>
                  <Badge className={getPriorityBadgeStyle(report.priority)}>
                    {report.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(report.status)}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{report.date}</TableCell>
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
            ))}
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
          {selectedReport && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title" 
                  value={selectedReport.title}
                  onChange={(e) => setSelectedReport({...selectedReport, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Type</Label>
                <Input 
                  id="edit-type" 
                  value={selectedReport.type}
                  onChange={(e) => setSelectedReport({...selectedReport, type: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-reportedBy">Reported By</Label>
                <Input 
                  id="edit-reportedBy" 
                  value={selectedReport.reportedBy}
                  onChange={(e) => setSelectedReport({...selectedReport, reportedBy: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input 
                  id="edit-location" 
                  value={selectedReport.location}
                  onChange={(e) => setSelectedReport({...selectedReport, location: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={saveEdit}>
              Save Changes
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
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Reports;
