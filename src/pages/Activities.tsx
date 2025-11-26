import { useState } from "react";
import { Plus, Edit2, Trash2, CalendarIcon, MapPin, Users } from "lucide-react";
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

type Activity = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  date: string;
  time: string;
  location: string;
  expected_participants: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

const Activities = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    date: "",
    time: "",
    location: "",
    expected_participants: "",
    status: "Scheduled",
  });

  // Fetch activities
  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      return data as Activity[];
    },
  });

  // Add activity mutation
  const addActivityMutation = useMutation({
    mutationFn: async (newActivity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('activities')
        .insert([newActivity])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Activity created",
        description: "The activity has been added successfully.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create activity: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update activity mutation
  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Activity> & { id: string }) => {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Activity updated",
        description: "The activity has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      setSelectedActivity(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update activity: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Activity deleted",
        description: "The activity has been removed successfully.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedActivity(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete activity: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "",
      date: "",
      time: "",
      location: "",
      expected_participants: "",
      status: "Scheduled",
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    if (normalizedStatus === "Scheduled") {
      return "bg-accent text-accent-foreground hover:bg-accent/90";
    }
    if (normalizedStatus === "Ongoing") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    if (normalizedStatus === "Completed") {
      return "bg-muted text-muted-foreground hover:bg-muted/90";
    }
    if (normalizedStatus === "Cancelled") {
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    }
    return "bg-muted text-muted-foreground hover:bg-muted/90";
  };

  const cycleStatus = (currentStatus: string) => {
    const statuses = ["Scheduled", "Ongoing", "Completed", "Cancelled"];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  const handleStatusClick = (activity: Activity) => {
    const newStatus = cycleStatus(activity.status);
    updateActivityMutation.mutate({ id: activity.id, status: newStatus });
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description || "",
      type: activity.type,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      expected_participants: activity.expected_participants?.toString() || "",
      status: activity.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedActivity) {
      deleteActivityMutation.mutate(selectedActivity.id);
    }
  };

  const handleAddSubmit = () => {
    if (!formData.name || !formData.type || !formData.date || !formData.time || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addActivityMutation.mutate({
      name: formData.name,
      description: formData.description || null,
      type: formData.type,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      expected_participants: formData.expected_participants ? parseInt(formData.expected_participants) : null,
      status: formData.status,
    });
  };

  const handleEditSubmit = () => {
    if (!selectedActivity) return;
    
    if (!formData.name || !formData.type || !formData.date || !formData.time || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    updateActivityMutation.mutate({
      id: selectedActivity.id,
      name: formData.name,
      description: formData.description || null,
      type: formData.type,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      expected_participants: formData.expected_participants ? parseInt(formData.expected_participants) : null,
      status: formData.status,
    });
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateObj = new Date(`${date}T${time}`);
      return format(dateObj, "MMM dd, yyyy hh:mm a");
    } catch {
      return `${date} ${time}`;
    }
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
                <Input 
                  id="activity" 
                  placeholder="Community Clean-up Drive"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Brief description of the activity..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Health Program">Health Program</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Sports & Recreation">Sports & Recreation</SelectItem>
                    <SelectItem value="Clean-up Drive">Clean-up Drive</SelectItem>
                    <SelectItem value="Feeding Program">Feeding Program</SelectItem>
                    <SelectItem value="Community Meeting">Community Meeting</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input 
                    id="time" 
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Barangay Hall"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="participants">Expected Participants</Label>
                <Input 
                  id="participants" 
                  type="number" 
                  placeholder="50"
                  value={formData.expected_participants}
                  onChange={(e) => setFormData({...formData, expected_participants: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90" 
                onClick={handleAddSubmit}
                disabled={addActivityMutation.isPending}
              >
                {addActivityMutation.isPending ? "Saving..." : "Save Activity"}
              </Button>
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
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No activities found. Create your first activity to get started.
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{activity.name}</div>
                      {activity.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {activity.description}
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
                      <span>{formatDateTime(activity.date, activity.time)}</span>
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
                      <span>{activity.expected_participants || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getStatusBadgeStyle(activity.status)} cursor-pointer`}
                      onClick={() => handleStatusClick(activity)}
                    >
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEdit(activity)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(activity)}
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
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Update the activity information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-activity">Activity Name</Label>
              <Input 
                id="edit-activity" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health Program">Health Program</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Sports & Recreation">Sports & Recreation</SelectItem>
                  <SelectItem value="Clean-up Drive">Clean-up Drive</SelectItem>
                  <SelectItem value="Feeding Program">Feeding Program</SelectItem>
                  <SelectItem value="Community Meeting">Community Meeting</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input 
                  id="edit-date" 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input 
                  id="edit-time" 
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input 
                id="edit-location" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-participants">Expected Participants</Label>
              <Input 
                id="edit-participants" 
                type="number"
                value={formData.expected_participants}
                onChange={(e) => setFormData({...formData, expected_participants: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedActivity(null); }}>
              Cancel
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              onClick={handleEditSubmit}
              disabled={updateActivityMutation.isPending}
            >
              {updateActivityMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedActivity?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteActivityMutation.isPending}
            >
              {deleteActivityMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Activities;
