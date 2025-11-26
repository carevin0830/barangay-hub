import { useState } from "react";
import { Search, Home, MapPin, Edit2, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import HouseholdsMap from "@/components/HouseholdsMap";
import InteractiveMap from "@/components/InteractiveMap";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useHouseholds, type Household } from "@/hooks/useHouseholds";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";

const Households = () => {
  const { households, loading, addHousehold, updateHousehold, deleteHousehold } = useHouseholds();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  
  // Form state for add dialog
  const [newHousehold, setNewHousehold] = useState({
    house_number: '',
    purok: '',
    street_address: '',
    latitude: 14.5995,
    longitude: 120.9842,
    has_electricity: false,
    has_water: false,
  });

  const handleEdit = (household: Household) => {
    setSelectedHousehold(household);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (household: Household) => {
    setSelectedHousehold(household);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedHousehold) {
      await deleteHousehold(selectedHousehold.id);
      setIsDeleteDialogOpen(false);
      setSelectedHousehold(null);
    }
  };

  const handleAddHousehold = async () => {
    try {
      await addHousehold(newHousehold);
      setIsAddDialogOpen(false);
      setNewHousehold({
        house_number: '',
        purok: '',
        street_address: '',
        latitude: 14.5995,
        longitude: 120.9842,
        has_electricity: false,
        has_water: false,
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const saveEdit = async () => {
    if (selectedHousehold) {
      await updateHousehold(selectedHousehold.id, selectedHousehold);
      setIsEditDialogOpen(false);
      setSelectedHousehold(null);
    }
  };

  const filteredHouseholds = households.filter(h => 
    h.house_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.purok?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">Households</h1>
        <p className="text-sm text-muted-foreground">
          Manage household information and utilities
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by house number or purok..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Home className="h-4 w-4" />
              Add Household
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Household</DialogTitle>
              <DialogDescription>
                Enter the household information. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="houseNumber">House Number *</Label>
                <Input 
                  id="houseNumber" 
                  placeholder="e.g., 101, 102A"
                  value={newHousehold.house_number}
                  onChange={(e) => setNewHousehold({...newHousehold, house_number: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purok">Purok</Label>
                <Input 
                  id="purok" 
                  placeholder="e.g., Purok 1"
                  value={newHousehold.purok}
                  onChange={(e) => setNewHousehold({...newHousehold, purok: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Street Address</Label>
                <Input 
                  id="address" 
                  placeholder="e.g., Sampaguita Street"
                  value={newHousehold.street_address}
                  onChange={(e) => setNewHousehold({...newHousehold, street_address: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Location on Map</Label>
                <InteractiveMap 
                  latitude={newHousehold.latitude}
                  longitude={newHousehold.longitude}
                  onLocationChange={(lat, lng) => setNewHousehold({...newHousehold, latitude: lat, longitude: lng})}
                  className="w-full h-[300px] rounded-lg border border-border"
                />
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {newHousehold.latitude.toFixed(6)}, {newHousehold.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-muted-foreground">Click map or drag marker to select location</p>
              </div>
              <div className="grid gap-3">
                <Label>Utility Connections</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connected to Electricity</span>
                  <Switch 
                    checked={newHousehold.has_electricity}
                    onCheckedChange={(checked) => setNewHousehold({...newHousehold, has_electricity: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connected to Water Supply</span>
                  <Switch 
                    checked={newHousehold.has_water}
                    onCheckedChange={(checked) => setNewHousehold({...newHousehold, has_water: checked})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={handleAddHousehold}
                disabled={!newHousehold.house_number}
              >
                Save Household
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Map */}
      <div className="rounded-lg border border-border bg-card overflow-hidden mb-6">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Households Map</h2>
        </div>
        <HouseholdsMap className="w-full h-[400px]" />
      </div>

      {/* Households Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">All Households</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">House Number</TableHead>
              <TableHead className="font-medium">Purok</TableHead>
              <TableHead className="font-medium">Address</TableHead>
              <TableHead className="font-medium">Residents</TableHead>
              <TableHead className="font-medium">Utilities</TableHead>
              <TableHead className="font-medium">Location</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : filteredHouseholds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No households found
                </TableCell>
              </TableRow>
            ) : (
              filteredHouseholds.map((household) => (
                <TableRow key={household.id}>
                  <TableCell className="font-medium">{household.house_number}</TableCell>
                  <TableCell className="text-muted-foreground">{household.purok || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">{household.street_address || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>0</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      {household.has_electricity && <span className="text-green-600">⚡ Electricity</span>}
                      {household.has_water && <span className="text-blue-600">💧 Water</span>}
                      {!household.has_electricity && !household.has_water && <span className="text-muted-foreground">No utilities</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {household.latitude && household.longitude ? (
                      <MapPin className="h-4 w-4 text-green-600" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEdit(household)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(household)}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Household</DialogTitle>
            <DialogDescription>
              Update the household information.
            </DialogDescription>
          </DialogHeader>
          {selectedHousehold && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-houseNumber">House Number *</Label>
                <Input 
                  id="edit-houseNumber" 
                  value={selectedHousehold.house_number}
                  onChange={(e) => setSelectedHousehold({...selectedHousehold, house_number: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-purok">Purok</Label>
                <Input 
                  id="edit-purok" 
                  value={selectedHousehold.purok || ''}
                  onChange={(e) => setSelectedHousehold({...selectedHousehold, purok: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Street Address</Label>
                <Input 
                  id="edit-address" 
                  value={selectedHousehold.street_address || ''}
                  onChange={(e) => setSelectedHousehold({...selectedHousehold, street_address: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Location on Map</Label>
                <InteractiveMap 
                  latitude={selectedHousehold.latitude || 14.5995}
                  longitude={selectedHousehold.longitude || 120.9842}
                  onLocationChange={(lat, lng) => setSelectedHousehold({...selectedHousehold, latitude: lat, longitude: lng})}
                  className="w-full h-[300px] rounded-lg border border-border"
                />
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {(selectedHousehold.latitude || 14.5995).toFixed(6)}, {(selectedHousehold.longitude || 120.9842).toFixed(6)}
                </p>
                <p className="text-xs text-muted-foreground">Click map or drag marker to select location</p>
              </div>
              <div className="grid gap-3">
                <Label>Utility Connections</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connected to Electricity</span>
                  <Switch 
                    checked={selectedHousehold.has_electricity}
                    onCheckedChange={(checked) => setSelectedHousehold({...selectedHousehold, has_electricity: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connected to Water Supply</span>
                  <Switch 
                    checked={selectedHousehold.has_water}
                    onCheckedChange={(checked) => setSelectedHousehold({...selectedHousehold, has_water: checked})}
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
            <AlertDialogTitle>Delete Household</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete House {selectedHousehold?.house_number}? This action cannot be undone.
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

export default Households;
