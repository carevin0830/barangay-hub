import { useState } from "react";
import { Search, Home, MapPin, Edit2, Trash2, Users } from "lucide-react";
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

const initialHouseholds = [
  { id: 1, houseNumber: "103", purok: "Longlongboy", address: "Villamor Street", residents: 2, utilities: "No utilities" },
  { id: 2, houseNumber: "105", purok: "bisil", address: "bravo street", residents: 1, utilities: "No utilities" },
  { id: 3, houseNumber: "106", purok: "ZONE 3", address: "LUMCANG STREET", residents: 1, utilities: "No utilities" },
];

const Households = () => {
  const { toast } = useToast();
  const [households, setHouseholds] = useState(initialHouseholds);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<typeof initialHouseholds[0] | null>(null);

  const handleEdit = (household: typeof initialHouseholds[0]) => {
    setSelectedHousehold(household);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (household: typeof initialHouseholds[0]) => {
    setSelectedHousehold(household);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedHousehold) {
      setHouseholds(households.filter(h => h.id !== selectedHousehold.id));
      toast({
        title: "Household deleted",
        description: `House ${selectedHousehold.houseNumber} has been removed.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedHousehold(null);
    }
  };

  const saveEdit = () => {
    if (selectedHousehold) {
      setHouseholds(households.map(h => 
        h.id === selectedHousehold.id ? selectedHousehold : h
      ));
      toast({
        title: "Household updated",
        description: `House ${selectedHousehold.houseNumber} has been updated.`,
      });
      setIsEditDialogOpen(false);
      setSelectedHousehold(null);
    }
  };

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
                <Label htmlFor="houseNumber">House Number</Label>
                <Input id="houseNumber" placeholder="103" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purok">Purok/Zone</Label>
                <Select>
                  <SelectTrigger id="purok">
                    <SelectValue placeholder="Select purok" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zone1">Zone 1</SelectItem>
                    <SelectItem value="zone2">Zone 2</SelectItem>
                    <SelectItem value="zone3">Zone 3</SelectItem>
                    <SelectItem value="longlongboy">Longlongboy</SelectItem>
                    <SelectItem value="bisil">Bisil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Villamor Street" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="headOfHousehold">Head of Household</Label>
                <Input id="headOfHousehold" placeholder="Juan Dela Cruz" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="utilities">Utilities Status</Label>
                <Select>
                  <SelectTrigger id="utilities">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No utilities</SelectItem>
                    <SelectItem value="electricity">Electricity only</SelectItem>
                    <SelectItem value="water">Water only</SelectItem>
                    <SelectItem value="both">Electricity & Water</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90">Save Household</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            {households.map((household) => (
              <TableRow key={household.id}>
                <TableCell className="font-medium">{household.houseNumber}</TableCell>
                <TableCell className="text-secondary">{household.purok}</TableCell>
                <TableCell className="text-accent">{household.address}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{household.residents}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-destructive text-sm">{household.utilities}</span>
                </TableCell>
                <TableCell>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
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
            ))}
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
                <Label htmlFor="edit-houseNumber">House Number</Label>
                <Input 
                  id="edit-houseNumber" 
                  value={selectedHousehold.houseNumber}
                  onChange={(e) => setSelectedHousehold({...selectedHousehold, houseNumber: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-purok">Purok/Zone</Label>
                <Input 
                  id="edit-purok" 
                  value={selectedHousehold.purok}
                  onChange={(e) => setSelectedHousehold({...selectedHousehold, purok: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input 
                  id="edit-address" 
                  value={selectedHousehold.address}
                  onChange={(e) => setSelectedHousehold({...selectedHousehold, address: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-utilities">Utilities Status</Label>
                <Input 
                  id="edit-utilities" 
                  value={selectedHousehold.utilities}
                  onChange={(e) => setSelectedHousehold({...selectedHousehold, utilities: e.target.value})}
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
            <AlertDialogTitle>Delete Household</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete House {selectedHousehold?.houseNumber}? This action cannot be undone.
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
