import { useState } from "react";
import { Search, Plus, Edit2, Trash2, CalendarIcon, MapPin, Users } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockActivities = [
  {
    id: 1,
    activity: "test",
    subtitle: "test",
    type: "Health Program",
    dateTime: "Oct 03, 2025 10:20 AM",
    location: "help",
    participants: 20,
    status: "Cancelled",
  },
];

const Activities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Upcoming") {
      return "bg-accent text-accent-foreground hover:bg-accent/90";
    }
    if (status === "Ongoing") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    if (status === "Completed") {
      return "bg-muted text-muted-foreground hover:bg-muted/90";
    }
    if (status === "Cancelled") {
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    }
    return "bg-muted text-muted-foreground hover:bg-muted/90";
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
          Barangay Activities
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage community events and activities
        </p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              New Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
              <DialogDescription>
                Enter the activity information. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="activity">Activity Name</Label>
                <Input id="activity" placeholder="Community Clean-up Drive" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Brief description of the activity..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health Program</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="sports">Sports & Recreation</SelectItem>
                    <SelectItem value="cleanup">Clean-up Drive</SelectItem>
                    <SelectItem value="feeding">Feeding Program</SelectItem>
                    <SelectItem value="meeting">Community Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Barangay Hall" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="participants">Expected Participants</Label>
                <Input id="participants" type="number" placeholder="50" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90">Save Activity</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Activities Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Activities & Events</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Activity</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Date & Time</TableHead>
              <TableHead className="font-medium">Location</TableHead>
              <TableHead className="font-medium">Participants</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{activity.activity}</div>
                    {activity.subtitle && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {activity.subtitle}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                    {activity.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{activity.dateTime}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{activity.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{activity.participants}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(activity.status)}>
                    {activity.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Activities;
