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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockOrdinances = [
  {
    id: 1,
    ordinanceNo: "8788",
    title: "test",
    subtitle: "test",
    dateEnacted: "Oct 22, 2025",
    status: "Amended",
  },
  {
    id: 2,
    ordinanceNo: "ORDINANCE NO. 2",
    title: "AN ORDINANCE ENACTING THE BARANGAY TAX CODE OF POBLACION, LAGANGILANG, ABRA",
    subtitle: "SECTION 5-LOCAL TAXING AUTHORITY. THE POWER TO IMPOSE A TAX, FEE, OR CHARGE OR TO...",
    dateEnacted: "Nov 20, 2023",
    status: "Active",
  },
];

const Ordinances = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Active") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    if (status === "Amended") {
      return "bg-secondary text-secondary-foreground hover:bg-secondary/90";
    }
    return "bg-muted text-muted-foreground hover:bg-muted/90";
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
                <Input id="ordinanceNo" placeholder="ORDINANCE NO. 1" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="AN ORDINANCE..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description/Section</Label>
                <Textarea 
                  id="description" 
                  placeholder="SECTION 1 - Brief description of the ordinance..."
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateEnacted">Date Enacted</Label>
                <Input id="dateEnacted" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="amended">Amended</SelectItem>
                    <SelectItem value="repealed">Repealed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90">Save Ordinance</Button>
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
            {mockOrdinances.map((ordinance) => (
              <TableRow key={ordinance.id}>
                <TableCell className="font-medium">{ordinance.ordinanceNo}</TableCell>
                <TableCell className="max-w-md">
                  <div>
                    <div className="font-medium text-secondary">{ordinance.title}</div>
                    {ordinance.subtitle && (
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {ordinance.subtitle}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{ordinance.dateEnacted}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(ordinance.status)}>
                    {ordinance.status}
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

export default Ordinances;
