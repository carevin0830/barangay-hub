import { useState } from "react";
import { Search, UserPlus, Edit2, Trash2 } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockOfficials = [
  {
    id: 1,
    name: "CATHERINE ARTIENDA DUMLAO",
    position: "Secretary",
    termStart: "Jul 1, 2019",
    termEnd: "—",
    status: "Active",
    initials: "CD",
  },
];

const Officials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Active") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    return "bg-muted text-muted-foreground hover:bg-muted/90";
  };

  return (
    <div className="p-6 md:p-8">
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
                <Label htmlFor="fullname">Full Name</Label>
                <Input id="fullname" placeholder="Juan Dela Cruz" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Select>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="captain">Barangay Captain</SelectItem>
                    <SelectItem value="secretary">Secretary</SelectItem>
                    <SelectItem value="treasurer">Treasurer</SelectItem>
                    <SelectItem value="councilor">Councilor</SelectItem>
                    <SelectItem value="sk-chairman">SK Chairman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="termStart">Term Start</Label>
                  <Input id="termStart" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="termEnd">Term End</Label>
                  <Input id="termEnd" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90">Save Official</Button>
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
            {mockOfficials.map((official) => (
              <TableRow key={official.id}>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                      {official.initials}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{official.name}</TableCell>
                <TableCell className="text-muted-foreground">{official.position}</TableCell>
                <TableCell>{official.termStart}</TableCell>
                <TableCell className="text-muted-foreground">{official.termEnd}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(official.status)}>
                    {official.status}
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

export default Officials;
