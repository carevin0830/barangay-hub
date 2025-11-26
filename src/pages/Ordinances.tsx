import { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
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

type Ordinance = {
  id: string;
  ordinance_number: string;
  title: string;
  description: string;
  date_enacted: string;
  status: string;
};

const Ordinances = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrdinance, setSelectedOrdinance] = useState<Ordinance | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    ordinance_number: "",
    title: "",
    description: "",
    date_enacted: "",
    status: "Active",
  });

  // Fetch ordinances
  const { data: ordinances = [] } = useQuery({
    queryKey: ["ordinances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ordinances")
        .select("*")
        .order("date_enacted", { ascending: false });
      
      if (error) throw error;
      return data as Ordinance[];
    },
  });

  // Add ordinance mutation
  const addOrdinanceMutation = useMutation({
    mutationFn: async (newOrdinance: typeof formData) => {
      const { error } = await supabase
        .from("ordinances")
        .insert([newOrdinance]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordinances"] });
      toast({
        title: "Ordinance added",
        description: "The ordinance has been successfully added.",
      });
      setIsAddDialogOpen(false);
      setFormData({
        ordinance_number: "",
        title: "",
        description: "",
        date_enacted: "",
        status: "Active",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update ordinance mutation
  const updateOrdinanceMutation = useMutation({
    mutationFn: async (updatedOrdinance: Ordinance) => {
      const { error } = await supabase
        .from("ordinances")
        .update({
          ordinance_number: updatedOrdinance.ordinance_number,
          title: updatedOrdinance.title,
          description: updatedOrdinance.description,
          date_enacted: updatedOrdinance.date_enacted,
          status: updatedOrdinance.status,
        })
        .eq("id", updatedOrdinance.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordinances"] });
      toast({
        title: "Ordinance updated",
        description: "The ordinance has been successfully updated.",
      });
      setIsEditDialogOpen(false);
      setSelectedOrdinance(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete ordinance mutation
  const deleteOrdinanceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ordinances")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordinances"] });
      toast({
        title: "Ordinance deleted",
        description: "The ordinance has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedOrdinance(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Active") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    if (status === "Amended") {
      return "bg-secondary text-secondary-foreground hover:bg-secondary/90";
    }
    return "bg-muted text-muted-foreground hover:bg-muted/90";
  };

  const handleEdit = (ordinance: Ordinance) => {
    setSelectedOrdinance(ordinance);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (ordinance: Ordinance) => {
    setSelectedOrdinance(ordinance);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOrdinance) {
      deleteOrdinanceMutation.mutate(selectedOrdinance.id);
    }
  };

  const saveEdit = () => {
    if (selectedOrdinance) {
      updateOrdinanceMutation.mutate(selectedOrdinance);
    }
  };

  const handleAddOrdinance = () => {
    if (!formData.ordinance_number || !formData.title || !formData.description || !formData.date_enacted) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    addOrdinanceMutation.mutate(formData);
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
          Barangay Ordinances
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage barangay ordinances and regulations
        </p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Add Ordinance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Ordinance</DialogTitle>
              <DialogDescription>
                Enter the ordinance information. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ordinanceNo">Ordinance Number</Label>
                <Input 
                  id="ordinanceNo" 
                  placeholder="ORDINANCE NO. 1" 
                  value={formData.ordinance_number}
                  onChange={(e) => setFormData({ ...formData, ordinance_number: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="AN ORDINANCE..." 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description/Section</Label>
                <Textarea 
                  id="description" 
                  placeholder="SECTION 1 - Brief description of the ordinance..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateEnacted">Date Enacted</Label>
                <Input 
                  id="dateEnacted" 
                  type="date" 
                  value={formData.date_enacted}
                  onChange={(e) => setFormData({ ...formData, date_enacted: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Amended">Amended</SelectItem>
                    <SelectItem value="Repealed">Repealed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={handleAddOrdinance}
              >
                Save Ordinance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Ordinances List */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Ordinances List</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Ordinance No.</TableHead>
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Date Enacted</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordinances.map((ordinance) => (
              <TableRow key={ordinance.id}>
                <TableCell className="font-medium">{ordinance.ordinance_number}</TableCell>
                <TableCell className="max-w-md">
                  <div>
                    <div className="font-medium text-secondary">{ordinance.title}</div>
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {ordinance.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(ordinance.date_enacted), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(ordinance.status)}>
                    {ordinance.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEdit(ordinance)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(ordinance)}
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
            <DialogTitle>Edit Ordinance</DialogTitle>
            <DialogDescription>
              Update the ordinance information.
            </DialogDescription>
          </DialogHeader>
          {selectedOrdinance && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-ordinanceNo">Ordinance Number</Label>
                <Input 
                  id="edit-ordinanceNo" 
                  value={selectedOrdinance.ordinance_number}
                  onChange={(e) => setSelectedOrdinance({...selectedOrdinance, ordinance_number: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title" 
                  value={selectedOrdinance.title}
                  onChange={(e) => setSelectedOrdinance({...selectedOrdinance, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description/Section</Label>
                <Textarea 
                  id="edit-description" 
                  value={selectedOrdinance.description}
                  onChange={(e) => setSelectedOrdinance({...selectedOrdinance, description: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dateEnacted">Date Enacted</Label>
                <Input 
                  id="edit-dateEnacted" 
                  type="date"
                  value={selectedOrdinance.date_enacted}
                  onChange={(e) => setSelectedOrdinance({...selectedOrdinance, date_enacted: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={selectedOrdinance.status}
                  onValueChange={(value) => setSelectedOrdinance({...selectedOrdinance, status: value})}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Amended">Amended</SelectItem>
                    <SelectItem value="Repealed">Repealed</SelectItem>
                  </SelectContent>
                </Select>
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
            <AlertDialogTitle>Delete Ordinance</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedOrdinance?.ordinance_number}? This action cannot be undone.
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

export default Ordinances;
