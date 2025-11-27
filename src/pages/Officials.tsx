import { useState, useRef } from "react";
import { Search, UserPlus, Edit2, Trash2, Check, ChevronsUpDown, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Official = {
  id: string;
  resident_id: string;
  position: string;
  term_start: string;
  term_end: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  residents: {
    full_name: string;
    photo_url: string | null;
  };
};

type Resident = {
  id: string;
  full_name: string;
  age: number;
  status: string;
};

const Officials = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);
  const [openResidentCombobox, setOpenResidentCombobox] = useState(false);
  const [openEditResidentCombobox, setOpenEditResidentCombobox] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newOfficial, setNewOfficial] = useState({
    resident_id: "",
    position: "",
    term_start: "",
    term_end: "",
    status: "Active"
  });

  // Fetch officials
  const { data: officials = [] } = useQuery<Official[]>({
    queryKey: ['officials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('officials')
        .select('*, residents(full_name, photo_url)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as unknown as Official[]) || [];
    }
  });

  // Fetch active residents
  const { data: residents = [] } = useQuery<Resident[]>({
    queryKey: ['active-residents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('residents')
        .select('id, full_name, age, status')
        .eq('status', 'Active')
        .order('full_name');
      
      if (error) throw error;
      return (data as unknown as Resident[]) || [];
    }
  });

  // Add mutation
  const addMutation = useMutation({
    mutationFn: async (official: any) => {
      const { data, error } = await supabase
        .from('officials')
        .insert([official])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officials'] });
      toast({
        title: "Official added",
        description: "New official has been added successfully.",
      });
      setIsAddDialogOpen(false);
      setNewOfficial({
        resident_id: "",
        position: "",
        term_start: "",
        term_end: "",
        status: "Active"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add official. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (official: any) => {
      const { data, error } = await supabase
        .from('officials')
        .update({
          resident_id: official.resident_id,
          position: official.position,
          term_start: official.term_start,
          term_end: official.term_end || null,
          status: official.status
        })
        .eq('id', official.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officials'] });
      toast({
        title: "Official updated",
        description: "Official information has been updated.",
      });
      setIsEditDialogOpen(false);
      setSelectedOfficial(null);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('officials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officials'] });
      toast({
        title: "Official deleted",
        description: "Official has been removed.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedOfficial(null);
    }
  });

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Active") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    return "bg-muted text-muted-foreground hover:bg-muted/90";
  };

  const cycleStatus = (currentStatus: string) => {
    return currentStatus === "Active" ? "Inactive" : "Active";
  };

  const handleStatusClick = async (official: Official) => {
    const newStatus = cycleStatus(official.status);
    await updateMutation.mutateAsync({ ...official, status: newStatus });
  };

  const handleEdit = (official: Official) => {
    setSelectedOfficial(official);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (official: Official) => {
    setSelectedOfficial(official);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOfficial) {
      deleteMutation.mutate(selectedOfficial.id);
    }
  };

  const saveEdit = () => {
    if (selectedOfficial) {
      updateMutation.mutate(selectedOfficial);
    }
  };

  const handleAddOfficial = () => {
    if (!newOfficial.resident_id || !newOfficial.position || !newOfficial.term_start || !newOfficial.status) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addMutation.mutate({
      resident_id: newOfficial.resident_id,
      position: newOfficial.position,
      term_start: newOfficial.term_start,
      term_end: newOfficial.term_end || null,
      status: newOfficial.status
    });
  };

  const handlePhotoUpload = async (residentId: string, file: File) => {
    try {
      setUploadingPhoto(residentId);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${residentId}-${Date.now()}.${fileExt}`;
      
      // Upload to storage
      const { error: uploadError, data } = await supabase.storage
        .from('official-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('official-photos')
        .getPublicUrl(fileName);

      // Update resident record with photo URL
      const { error: updateError } = await supabase
        .from('residents')
        .update({ photo_url: publicUrl })
        .eq('id', residentId);

      if (updateError) throw updateError;

      // Refresh officials data
      queryClient.invalidateQueries({ queryKey: ['officials'] });

      toast({
        title: "Photo uploaded",
        description: "Official photo has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingPhoto(null);
    }
  };

  const triggerPhotoUpload = (residentId: string) => {
    const input = fileInputRef.current;
    if (input) {
      input.dataset.residentId = residentId;
      input.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const residentId = e.target.dataset.residentId;
    
    if (file && residentId) {
      handlePhotoUpload(residentId, file);
    }
    
    // Reset input
    e.target.value = '';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const selectedResident = residents.find(r => r.id === newOfficial.resident_id);
  const selectedEditResident = residents.find(r => r.id === selectedOfficial?.resident_id);

  const filteredOfficials = officials.filter(official =>
    official.residents.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    official.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      {/* Hidden file input for photo uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        data-resident-id=""
      />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
          Barangay Officials
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage barangay officials and their positions
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search officials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <UserPlus className="h-4 w-4" />
              Add Official
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Official</DialogTitle>
              <DialogDescription>
                Enter the official's information. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="resident">Full Name</Label>
                <Popover open={openResidentCombobox} onOpenChange={setOpenResidentCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openResidentCombobox}
                      className="justify-between"
                    >
                      {selectedResident ? selectedResident.full_name : "Select resident..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search residents..." />
                      <CommandList>
                        <CommandEmpty>No resident found.</CommandEmpty>
                        <CommandGroup>
                          {residents.map((resident) => (
                            <CommandItem
                              key={resident.id}
                              value={resident.full_name}
                              onSelect={() => {
                                setNewOfficial({ ...newOfficial, resident_id: resident.id });
                                setOpenResidentCombobox(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  newOfficial.resident_id === resident.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {resident.full_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Select value={newOfficial.position} onValueChange={(value) => setNewOfficial({ ...newOfficial, position: value })}>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Barangay Captain">Barangay Captain</SelectItem>
                    <SelectItem value="Secretary">Secretary</SelectItem>
                    <SelectItem value="Treasurer">Treasurer</SelectItem>
                    <SelectItem value="Kagawad">Kagawad</SelectItem>
                    <SelectItem value="SK Chairperson">SK Chairperson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="termStart">Term Start</Label>
                  <Input
                    id="termStart"
                    type="date"
                    value={newOfficial.term_start}
                    onChange={(e) => setNewOfficial({ ...newOfficial, term_start: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="termEnd">Term End</Label>
                  <Input
                    id="termEnd"
                    type="date"
                    value={newOfficial.term_end}
                    onChange={(e) => setNewOfficial({ ...newOfficial, term_end: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newOfficial.status} onValueChange={(value) => setNewOfficial({ ...newOfficial, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
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
                onClick={handleAddOfficial}
                disabled={addMutation.isPending}
              >
                {addMutation.isPending ? "Saving..." : "Save Official"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Officials Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Officials Registry</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Photo</TableHead>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Position</TableHead>
              <TableHead className="font-medium">Term Start</TableHead>
              <TableHead className="font-medium">Term End</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOfficials.map((official) => (
              <TableRow key={official.id}>
                <TableCell>
                  <div className="relative group">
                    <Avatar className="h-10 w-10">
                      {official.residents.photo_url && (
                        <AvatarImage 
                          src={official.residents.photo_url} 
                          alt={official.residents.full_name}
                        />
                      )}
                      <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                        {getInitials(official.residents.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => triggerPhotoUpload(official.resident_id)}
                      disabled={uploadingPhoto === official.resident_id}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{official.residents.full_name}</TableCell>
                <TableCell className="text-muted-foreground">{official.position}</TableCell>
                <TableCell>{new Date(official.term_start).toLocaleDateString()}</TableCell>
                <TableCell className="text-muted-foreground">
                  {official.term_end ? new Date(official.term_end).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusBadgeStyle(official.status)} cursor-pointer`}
                    onClick={() => handleStatusClick(official)}
                  >
                    {official.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(official)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(official)}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Official</DialogTitle>
            <DialogDescription>
              Update the official's information.
            </DialogDescription>
          </DialogHeader>
          {selectedOfficial && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-resident">Full Name</Label>
                <Popover open={openEditResidentCombobox} onOpenChange={setOpenEditResidentCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEditResidentCombobox}
                      className="justify-between"
                    >
                      {selectedEditResident ? selectedEditResident.full_name : "Select resident..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search residents..." />
                      <CommandList>
                        <CommandEmpty>No resident found.</CommandEmpty>
                        <CommandGroup>
                          {residents.map((resident) => (
                            <CommandItem
                              key={resident.id}
                              value={resident.full_name}
                              onSelect={() => {
                                setSelectedOfficial({ ...selectedOfficial, resident_id: resident.id });
                                setOpenEditResidentCombobox(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedOfficial.resident_id === resident.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {resident.full_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-position">Position</Label>
                <Select
                  value={selectedOfficial.position}
                  onValueChange={(value) => setSelectedOfficial({ ...selectedOfficial, position: value })}
                >
                  <SelectTrigger id="edit-position">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Barangay Captain">Barangay Captain</SelectItem>
                    <SelectItem value="Secretary">Secretary</SelectItem>
                    <SelectItem value="Treasurer">Treasurer</SelectItem>
                    <SelectItem value="Kagawad">Kagawad</SelectItem>
                    <SelectItem value="SK Chairperson">SK Chairperson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-termStart">Term Start</Label>
                  <Input
                    id="edit-termStart"
                    type="date"
                    value={selectedOfficial.term_start}
                    onChange={(e) => setSelectedOfficial({ ...selectedOfficial, term_start: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-termEnd">Term End</Label>
                  <Input
                    id="edit-termEnd"
                    type="date"
                    value={selectedOfficial.term_end || ""}
                    onChange={(e) => setSelectedOfficial({ ...selectedOfficial, term_end: e.target.value })}
                  />
                </div>
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
            <AlertDialogTitle>Delete Official</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this official? This action cannot be undone.
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

export default Officials;