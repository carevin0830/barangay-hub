import { useState } from "react";
import { Search, UserPlus, FileText, MapPin, Edit2, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const initialResidents = [
  { id: 1, name: "CATHERINE ARTIENDA DUMLAO", age: 42, houseNumber: "106", status: "Active", specialStatus: "—", location: "Zone 1" },
  { id: 2, name: "Floricante L Cortez", age: 32, houseNumber: "103", status: "Active", specialStatus: "Senior", location: "Zone 2" },
  { id: 3, name: "Elizabeth Ballena Oca", age: 57, houseNumber: "105", status: "Active", specialStatus: "—", location: "Zone 1" },
  { id: 4, name: "Amalia A Cortez", age: 35, houseNumber: "103", status: "Active", specialStatus: "Senior", location: "Zone 3" },
];

const Residents = () => {
  const { toast } = useToast();
  const [residents, setResidents] = useState(initialResidents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<typeof initialResidents[0] | null>(null);

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Active") {
      return "border border-primary text-primary bg-transparent hover:bg-primary/5";
    }
    return "border border-muted-foreground text-muted-foreground bg-transparent hover:bg-muted/5";
  };

  const cycleStatus = (currentStatus: string) => {
    return currentStatus === "Active" ? "Inactive" : "Active";
  };

  const handleStatusClick = (resident: typeof initialResidents[0]) => {
    const newStatus = cycleStatus(resident.status);
    setResidents(residents.map(r => 
      r.id === resident.id ? { ...r, status: newStatus } : r
    ));
    toast({
      title: "Status updated",
      description: `${resident.name}'s status changed to ${newStatus}.`,
    });
  };

  const handleEdit = (resident: typeof initialResidents[0]) => {
    setSelectedResident(resident);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (resident: typeof initialResidents[0]) => {
    setSelectedResident(resident);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedResident) {
      setResidents(residents.filter(r => r.id !== selectedResident.id));
      toast({
        title: "Resident deleted",
        description: `${selectedResident.name} has been removed from the registry.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedResident(null);
    }
  };

  const saveEdit = () => {
    if (selectedResident) {
      setResidents(residents.map(r => 
        r.id === selectedResident.id ? selectedResident : r
      ));
      toast({
        title: "Resident updated",
        description: `${selectedResident.name}'s information has been updated.`,
      });
      setIsEditDialogOpen(false);
      setSelectedResident(null);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Residents</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
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
                  <Input id="fullname" placeholder="Juan Dela Cruz" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" placeholder="25" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zone">Zone/Purok</Label>
                  <Input id="zone" placeholder="e.g., Zone 1" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="senior">Senior Citizen</SelectItem>
                      <SelectItem value="pwd">PWD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="household">Household ID</Label>
                  <Input id="household" placeholder="HH-001" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90">Save Resident</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                <TableCell className="font-medium">{resident.name}</TableCell>
                <TableCell>{resident.age}</TableCell>
                <TableCell>{resident.houseNumber}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusBadgeStyle(resident.status)} cursor-pointer`}
                    onClick={() => handleStatusClick(resident)}
                  >
                    {resident.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{resident.specialStatus}</TableCell>
                <TableCell>
                  <MapPin className="h-4 w-4 text-muted-foreground inline" />
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
                  value={selectedResident.name}
                  onChange={(e) => setSelectedResident({...selectedResident, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-age">Age</Label>
                  <Input 
                    id="edit-age" 
                    type="number" 
                    value={selectedResident.age}
                    onChange={(e) => setSelectedResident({...selectedResident, age: parseInt(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-house">House Number</Label>
                  <Input 
                    id="edit-house" 
                    value={selectedResident.houseNumber}
                    onChange={(e) => setSelectedResident({...selectedResident, houseNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-zone">Zone/Purok</Label>
                <Input 
                  id="edit-zone" 
                  value={selectedResident.location}
                  onChange={(e) => setSelectedResident({...selectedResident, location: e.target.value})}
                  placeholder="e.g., Zone 1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-special">Special Status</Label>
                <Select 
                  value={selectedResident.specialStatus}
                  onValueChange={(value) => setSelectedResident({...selectedResident, specialStatus: value})}
                >
                  <SelectTrigger id="edit-special">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="—">None</SelectItem>
                    <SelectItem value="Senior">Senior Citizen</SelectItem>
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
              Are you sure you want to delete {selectedResident?.name}? This action cannot be undone.
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

export default Residents;
