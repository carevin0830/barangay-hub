import { useState } from "react";
import { Search, Plus, Eye, Download, Trash2, Edit2 } from "lucide-react";
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

const initialCertificates = [
  {
    id: 1,
    certificateNo: "CERT-2025-4717",
    type: "Business Permit",
    resident: "N/A",
    purpose: "for business",
    issuedDate: "Nov 21, 2025",
    validUntil: "Jan 30, 2025",
    status: "Expired",
  },
  {
    id: 2,
    certificateNo: "CERT-2025-1529",
    type: "Mayors Permit",
    resident: "N/A",
    purpose: "test",
    issuedDate: "Nov 20, 2025",
    validUntil: "Nov 21, 2025",
    status: "Expired",
  },
  {
    id: 3,
    certificateNo: "CERT-2025-5988",
    type: "Mayors Permit",
    resident: "N/A",
    purpose: "Cat org",
    issuedDate: "Nov 20, 2025",
    validUntil: "Nov 28, 2025",
    status: "Active",
  },
  {
    id: 4,
    certificateNo: "CERT-2025-6098",
    type: "Business Permit",
    resident: "N/A",
    purpose: "test",
    issuedDate: "Nov 04, 2025",
    validUntil: "Nov 05, 2025",
    status: "Expired",
  },
  {
    id: 5,
    certificateNo: "CERT-2025-1766",
    type: "Certificate Of Indigency",
    resident: "N/A",
    purpose: "School",
    issuedDate: "Nov 04, 2025",
    validUntil: "Nov 05, 2025",
    status: "Expired",
  },
  {
    id: 6,
    certificateNo: "CERT-2025-3062",
    type: "Residency",
    resident: "N/A",
    purpose: "test",
    issuedDate: "Nov 04, 2025",
    validUntil: "Nov 05, 2025",
    status: "Expired",
  },
  {
    id: 7,
    certificateNo: "CERT-2025-4730",
    type: "Certificate Of Indigency",
    resident: "N/A",
    purpose: "test",
    issuedDate: "Nov 04, 2025",
    validUntil: "Nov 05, 2025",
    status: "Expired",
  },
  {
    id: 8,
    certificateNo: "CERT-2025-2878",
    type: "Certificate Of Indigency",
    resident: "N/A",
    purpose: "test",
    issuedDate: "Nov 04, 2025",
    validUntil: "Nov 05, 2025",
    status: "Expired",
  },
];

const Certificates = () => {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState(initialCertificates);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<typeof initialCertificates[0] | null>(null);

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Active") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    if (status === "Expired") {
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    }
    return "bg-muted text-muted-foreground hover:bg-muted/90";
  };

  const handleEdit = (certificate: typeof initialCertificates[0]) => {
    setSelectedCertificate(certificate);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (certificate: typeof initialCertificates[0]) => {
    setSelectedCertificate(certificate);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCertificate) {
      setCertificates(certificates.filter(c => c.id !== selectedCertificate.id));
      toast({
        title: "Certificate deleted",
        description: `${selectedCertificate.certificateNo} has been removed.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedCertificate(null);
    }
  };

  const saveEdit = () => {
    if (selectedCertificate) {
      setCertificates(certificates.map(c => 
        c.id === selectedCertificate.id ? selectedCertificate : c
      ));
      toast({
        title: "Certificate updated",
        description: `${selectedCertificate.certificateNo} has been updated.`,
      });
      setIsEditDialogOpen(false);
      setSelectedCertificate(null);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
          Certificates
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate and manage barangay certificates
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by certificate number, resident name, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Generate Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Generate New Certificate</DialogTitle>
              <DialogDescription>
                Enter the certificate information. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Certificate Type</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residency">Certificate of Residency</SelectItem>
                    <SelectItem value="indigency">Certificate of Indigency</SelectItem>
                    <SelectItem value="clearance">Barangay Clearance</SelectItem>
                    <SelectItem value="business">Business Permit</SelectItem>
                    <SelectItem value="mayors">Mayor's Permit</SelectItem>
                    <SelectItem value="good-moral">Good Moral Character</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="resident">Resident Name</Label>
                <Input id="resident" placeholder="Juan Dela Cruz" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea 
                  id="purpose" 
                  placeholder="e.g., For employment, For school requirements..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issuedDate">Issued Date</Label>
                  <Input id="issuedDate" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input id="validUntil" type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90">Generate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Certificates Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Certificate No.</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Resident</TableHead>
              <TableHead className="font-medium">Purpose</TableHead>
              <TableHead className="font-medium">Issued Date</TableHead>
              <TableHead className="font-medium">Valid Until</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((certificate) => (
              <TableRow key={certificate.id}>
                <TableCell className="font-mono text-sm">{certificate.certificateNo}</TableCell>
                <TableCell className="text-secondary">{certificate.type}</TableCell>
                <TableCell className="text-muted-foreground">{certificate.resident}</TableCell>
                <TableCell className="text-accent">{certificate.purpose}</TableCell>
                <TableCell className="text-sm">{certificate.issuedDate}</TableCell>
                <TableCell className="text-sm">{certificate.validUntil}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(certificate.status)}>
                    {certificate.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEdit(certificate)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(certificate)}
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
            <DialogTitle>Edit Certificate</DialogTitle>
            <DialogDescription>
              Update the certificate information.
            </DialogDescription>
          </DialogHeader>
          {selectedCertificate && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Certificate Type</Label>
                <Input 
                  id="edit-type" 
                  value={selectedCertificate.type}
                  onChange={(e) => setSelectedCertificate({...selectedCertificate, type: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-resident">Resident Name</Label>
                <Input 
                  id="edit-resident" 
                  value={selectedCertificate.resident}
                  onChange={(e) => setSelectedCertificate({...selectedCertificate, resident: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-purpose">Purpose</Label>
                <Textarea 
                  id="edit-purpose" 
                  value={selectedCertificate.purpose}
                  onChange={(e) => setSelectedCertificate({...selectedCertificate, purpose: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-issuedDate">Issued Date</Label>
                  <Input 
                    id="edit-issuedDate" 
                    value={selectedCertificate.issuedDate}
                    onChange={(e) => setSelectedCertificate({...selectedCertificate, issuedDate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-validUntil">Valid Until</Label>
                  <Input 
                    id="edit-validUntil" 
                    value={selectedCertificate.validUntil}
                    onChange={(e) => setSelectedCertificate({...selectedCertificate, validUntil: e.target.value})}
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
            <AlertDialogTitle>Delete Certificate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCertificate?.certificateNo}? This action cannot be undone.
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

export default Certificates;
