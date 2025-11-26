import { useState, useEffect, useMemo } from "react";
import { Search, UserPlus, MapPin, Edit2, Trash2, Users } from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Resident = {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  purok: string;
  status: string;
  special_status: string | null;
  household_id: string | null;
  created_at: string;
  updated_at: string;
  households?: {
    house_number: string;
    purok: string;
    street_address: string;
    latitude: number;
    longitude: number;
  } | null;
};

const initialResidents = [
  { id: 1, name: "CATHERINE ARTIENDA DUMLAO", age: 42, houseNumber: "106", status: "Active", specialStatus: "—", location: "Zone 1" },
  { id: 2, name: "Floricante L Cortez", age: 32, houseNumber: "103", status: "Active", specialStatus: "Senior", location: "Zone 2" },
  { id: 3, name: "Elizabeth Ballena Oca", age: 57, houseNumber: "105", status: "Active", specialStatus: "—", location: "Zone 1" },
  { id: 4, name: "Amalia A Cortez", age: 35, houseNumber: "103", status: "Active", specialStatus: "Senior", location: "Zone 3" },
];

const Residents = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [newResident, setNewResident] = useState({
    full_name: "",
    age: "",
    gender: "",
    purok: "",
    special_status: "",
    household_id: ""
  });

  const { data: residents = [] } = useQuery<Resident[]>({
    queryKey: ['residents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('residents')
        .select('*, households(house_number, purok, street_address, latitude, longitude)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as unknown as Resident[]) || [];
    }
  });

  const { data: households = [] } = useQuery({
    queryKey: ['households'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('households')
        .select('*')
        .order('house_number');
      
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (resident: any) => {
      const { data, error } = await supabase
        .from('residents')
        .insert([resident])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      toast({
        title: "Resident added",
        description: "New resident has been added successfully.",
      });
      setIsAddDialogOpen(false);
      setNewResident({
        full_name: "",
        age: "",
        gender: "",
        purok: "",
        special_status: "",
        household_id: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add resident. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (resident: any) => {
      const { data, error } = await supabase
        .from('residents')
        .update({
          full_name: resident.full_name,
          age: resident.age,
          gender: resident.gender,
          purok: resident.purok,
          status: resident.status,
          special_status: resident.special_status,
          household_id: resident.household_id
        })
        .eq('id', resident.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      toast({
        title: "Resident updated",
        description: "Resident information has been updated.",
      });
      setIsEditDialogOpen(false);
      setSelectedResident(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('residents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      toast({
        title: "Resident deleted",
        description: "Resident has been removed from the registry.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedResident(null);
    }
  });

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Active") {
      return "border border-primary text-primary bg-transparent hover:bg-primary/5";
    }
    return "border border-muted-foreground text-muted-foreground bg-transparent hover:bg-muted/5";
  };

  const cycleStatus = (currentStatus: string) => {
    return currentStatus === "Active" ? "Inactive" : "Active";
  };

  const handleStatusClick = async (resident: Resident) => {
    const newStatus = cycleStatus(resident.status);
    await updateMutation.mutateAsync({ ...resident, status: newStatus });
  };

  const handleEdit = (resident: Resident) => {
    setSelectedResident(resident);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (resident: Resident) => {
    setSelectedResident(resident);
    setIsDeleteDialogOpen(true);
  };

  const handleViewLocation = (resident: Resident) => {
    if (resident.households?.latitude && resident.households?.longitude) {
      setSelectedResident(resident);
      setIsMapDialogOpen(true);
    } else {
      toast({
        title: "No location data",
        description: "This resident's household doesn't have location coordinates.",
        variant: "destructive"
      });
    }
  };

  const confirmDelete = () => {
    if (selectedResident) {
      deleteMutation.mutate(selectedResident.id);
    }
  };

  const saveEdit = () => {
    if (selectedResident) {
      updateMutation.mutate(selectedResident);
    }
  };

  const handleHouseholdChange = (householdId: string) => {
    const household = households.find((h: any) => h.id === householdId);
    if (household) {
      setNewResident({
        ...newResident,
        household_id: householdId,
        purok: household.purok || household.street_address || ""
      });
    }
  };

  const handleAddResident = () => {
    if (!newResident.full_name || !newResident.age || !newResident.gender || !newResident.household_id) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addMutation.mutate({
      full_name: newResident.full_name,
      age: parseInt(newResident.age),
      gender: newResident.gender,
      purok: newResident.purok,
      special_status: newResident.special_status === "none" ? null : newResident.special_status || null,
      household_id: newResident.household_id,
      status: "Active"
    });
  };

  const totalResidents = residents.length;
  const activeResidents = useMemo(() => residents.filter(r => r.status === 'Active').length, [residents]);
  const seniorCitizens = useMemo(() => residents.filter(r => r.special_status === 'Senior Citizen').length, [residents]);
  const pwdResidents = useMemo(() => residents.filter(r => r.special_status === 'PWD').length, [residents]);

  return (
    <div className="p-6 md:p-8">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Residents</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <UserPlus className="h-4 w-4" />
              Add Resident
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Resident</DialogTitle>
              <DialogDescription>
                Enter the resident's information. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input 
                  id="fullname" 
                  placeholder="Juan Dela Cruz"
                  value={newResident.full_name}
                  onChange={(e) => setNewResident(prev => ({...prev, full_name: e.target.value}))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    placeholder="25"
                    value={newResident.age}
                    onChange={(e) => setNewResident(prev => ({...prev, age: e.target.value}))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={newResident.gender} onValueChange={(value) => setNewResident(prev => ({...prev, gender: value}))}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="household">Household</Label>
                <Select value={newResident.household_id} onValueChange={handleHouseholdChange}>
                  <SelectTrigger id="household">
                    <SelectValue placeholder="Select household" />
                  </SelectTrigger>
                  <SelectContent>
                    {households.map((household: any) => (
                      <SelectItem key={household.id} value={household.id}>
                        House #{household.house_number} - {household.purok || household.street_address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="special-status">Special Status</Label>
                <Select value={newResident.special_status} onValueChange={(value) => setNewResident(prev => ({...prev, special_status: value}))}>
                  <SelectTrigger id="special-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {parseInt(newResident.age) >= 60 && (
                      <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                    )}
                    <SelectItem value="PWD">PWD</SelectItem>
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
                onClick={handleAddResident}
                disabled={addMutation.isPending}
              >
                {addMutation.isPending ? "Saving..." : "Save Resident"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalResidents}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{activeResidents}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{seniorCitizens}</p>
                <p className="text-sm text-muted-foreground">Seniors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{pwdResidents}</p>
                <p className="text-sm text-muted-foreground">PWD</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search residents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Residents Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Resident Registry</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Age</TableHead>
              <TableHead className="font-medium">House Number</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Special Status</TableHead>
              <TableHead className="font-medium">Location</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {residents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell className="font-medium">{resident.full_name}</TableCell>
                <TableCell>{resident.age}</TableCell>
                <TableCell>{resident.households?.house_number || "—"}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusBadgeStyle(resident.status)} cursor-pointer`}
                    onClick={() => handleStatusClick(resident)}
                  >
                    {resident.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{resident.special_status || "—"}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-primary hover:text-primary/80"
                    onClick={() => handleViewLocation(resident)}
                    disabled={!resident.households?.latitude || !resident.households?.longitude}
                  >
                    <MapPin className="h-4 w-4" />
                    {resident.households?.purok || resident.households?.street_address || "—"}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEdit(resident)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(resident)}
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
            <DialogTitle>Edit Resident</DialogTitle>
            <DialogDescription>
              Update the resident's information.
            </DialogDescription>
          </DialogHeader>
          {selectedResident && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-fullname">Full Name</Label>
                <Input 
                  id="edit-fullname" 
                  value={selectedResident.full_name}
                  onChange={(e) => setSelectedResident(prev => prev ? {...prev, full_name: e.target.value} : prev)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-age">Age</Label>
                  <Input 
                    id="edit-age" 
                    type="number" 
                    value={selectedResident.age}
                    onChange={(e) => setSelectedResident(prev => prev ? {...prev, age: parseInt(e.target.value)} : prev)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select 
                    value={selectedResident.gender}
                    onValueChange={(value) => setSelectedResident(prev => prev ? {...prev, gender: value} : prev)}
                  >
                    <SelectTrigger id="edit-gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-household">Household</Label>
                <Select 
                  value={selectedResident.household_id || "none"}
                  onValueChange={(value) => {
                    const household = households.find((h: any) => h.id === value);
                    setSelectedResident(prev => prev ? {
                      ...prev, 
                      household_id: value === "none" ? null : value,
                      purok: household ? (household.purok || household.street_address) : prev.purok
                    } : prev);
                  }}
                >
                  <SelectTrigger id="edit-household">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {households.map((household: any) => (
                      <SelectItem key={household.id} value={household.id}>
                        House #{household.house_number} - {household.purok || household.street_address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-special">Special Status</Label>
                <Select 
                  value={selectedResident.special_status || "none"}
                  onValueChange={(value) => setSelectedResident(prev => prev ? {...prev, special_status: value === "none" ? null : value} : prev)}
                >
                  <SelectTrigger id="edit-special">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {selectedResident.age >= 60 && (
                      <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                    )}
                    <SelectItem value="PWD">PWD</SelectItem>
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
            <AlertDialogTitle>Delete Resident</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedResident?.full_name}? This action cannot be undone.
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

      {/* Location Map Dialog */}
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Household Location</DialogTitle>
            <DialogDescription>
              {selectedResident?.full_name} - House #{selectedResident?.households?.house_number}
            </DialogDescription>
          </DialogHeader>
          <div className="h-[400px] rounded-lg overflow-hidden">
            {selectedResident?.households?.latitude && selectedResident?.households?.longitude && (
              <InteractiveMap
                latitude={selectedResident.households.latitude}
                longitude={selectedResident.households.longitude}
                className="w-full h-full"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMapDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Residents;
