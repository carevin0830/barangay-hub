import { useState, useRef } from "react";
import { Search, Plus, Eye, Download, Trash2, X } from "lucide-react";
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
import { CertificateTemplates } from "@/components/CertificateTemplates";
import { useReactToPrint } from "react-to-print";

type Resident = {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  purok: string;
};

type Certificate = {
  id: string;
  certificate_no: string;
  certificate_type: string;
  resident_id: string;
  resident_name: string;
  resident_age: number;
  purpose: string;
  issued_date: string;
  valid_until: string | null;
  status: string;
  control_number: string | null;
  amount_paid: number | null;
  business_type: string | null;
  verified_by_kagawad1: string | null;
  verified_by_kagawad2: string | null;
  created_at: string;
};

const Certificates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  // Form state
  const [residentSearchOpen, setResidentSearchOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [certificateType, setCertificateType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [controlNumber, setControlNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [kagawad1, setKagawad1] = useState("");
  const [kagawad2, setKagawad2] = useState("");

  // Fetch residents for selection
  const { data: residents = [] } = useQuery<Resident[]>({
    queryKey: ['residents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('residents')
        .select('id, full_name, age, gender, purok')
        .order('full_name');
      
      if (error) throw error;
      return (data as unknown as Resident[]) || [];
    }
  });

  // Fetch certificates
  const { data: certificates = [] } = useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as unknown as Certificate[]) || [];
    }
  });

  // Add certificate mutation
  const addMutation = useMutation({
    mutationFn: async (certificate: any) => {
      const certificateNo = `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
      
      const { data, error } = await supabase
        .from('certificates')
        .insert([{
          ...certificate,
          certificate_no: certificateNo,
          issued_date: new Date().toISOString().split('T')[0],
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast({
        title: "Certificate generated",
        description: `Certificate ${data.certificate_no} has been created.`,
      });
      setIsAddDialogOpen(false);
      resetForm();
      // Auto-preview the generated certificate
      setSelectedCertificate(data as Certificate);
      setIsPreviewOpen(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate certificate.",
        variant: "destructive"
      });
    }
  });

  // Delete certificate mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast({
        title: "Certificate deleted",
        description: "Certificate has been removed.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedCertificate(null);
    }
  });

  const resetForm = () => {
    setSelectedResident(null);
    setCertificateType("");
    setPurpose("");
    setBusinessType("");
    setControlNumber("");
    setAmountPaid("");
    setKagawad1("");
    setKagawad2("");
  };

  const handleGenerate = () => {
    if (!selectedResident || !certificateType || !purpose) {
      toast({
        title: "Missing fields",
        description: "Please select a resident, certificate type, and enter a purpose.",
        variant: "destructive"
      });
      return;
    }

    const certificateData: any = {
      certificate_type: certificateType,
      resident_id: selectedResident.id,
      resident_name: selectedResident.full_name,
      resident_age: selectedResident.age,
      purpose: purpose,
      status: "Active",
    };

    if (certificateType === "Business Permit") {
      certificateData.business_type = businessType;
      certificateData.control_number = controlNumber;
      certificateData.amount_paid = amountPaid ? parseFloat(amountPaid) : null;
    } else if (certificateType === "Certificate of Residency") {
      certificateData.verified_by_kagawad1 = kagawad1;
      certificateData.verified_by_kagawad2 = kagawad2;
      certificateData.amount_paid = amountPaid ? parseFloat(amountPaid) : 30;
    } else if (certificateType === "Barangay Clearance") {
      certificateData.amount_paid = amountPaid ? parseFloat(amountPaid) : 30;
    }

    addMutation.mutate(certificateData);
  };

  const handleDelete = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCertificate) {
      deleteMutation.mutate(selectedCertificate.id);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: certificateRef,
    documentTitle: selectedCertificate?.certificate_no || "Certificate",
  });

  const handlePreview = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsPreviewOpen(true);
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.certificate_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.resident_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.certificate_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Active") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
          Certificates
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate and manage barangay certificates
        </p>
      </div>

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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate New Certificate</DialogTitle>
              <DialogDescription>
                Search and select a resident, then fill in the certificate details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Select Resident</Label>
                <Popover open={residentSearchOpen} onOpenChange={setResidentSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      {selectedResident ? selectedResident.full_name : "Search resident..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search resident by name..." />
                      <CommandList>
                        <CommandEmpty>No resident found.</CommandEmpty>
                        <CommandGroup>
                          {residents.map((resident) => (
                            <CommandItem
                              key={resident.id}
                              onSelect={() => {
                                setSelectedResident(resident);
                                setResidentSearchOpen(false);
                              }}
                            >
                              {resident.full_name} - Age {resident.age}, {resident.purok}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedResident && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Selected: {selectedResident.full_name}, {selectedResident.age} years old</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedResident(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Certificate Type</Label>
                <Select value={certificateType} onValueChange={setCertificateType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certificate of Residency">Certificate of Residency</SelectItem>
                    <SelectItem value="Certificate of Indigency">Certificate of Indigency</SelectItem>
                    <SelectItem value="Barangay Clearance">Barangay Clearance</SelectItem>
                    <SelectItem value="Business Permit">Business Permit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea 
                  id="purpose" 
                  placeholder="e.g., employment, school requirements, business application..."
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              {certificateType === "Business Permit" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input 
                      id="businessType"
                      placeholder="e.g., Sari-sari Store, Bakery"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="controlNo">Control Number (Optional)</Label>
                      <Input 
                        id="controlNo"
                        placeholder="e.g., 2024-001"
                        value={controlNumber}
                        onChange={(e) => setControlNumber(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount Paid (₱)</Label>
                      <Input 
                        id="amount"
                        type="number"
                        placeholder="30"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {certificateType === "Certificate of Residency" && (
                <>
                  <div className="grid gap-2">
                    <Label>Verified by Barangay Kagawads (Optional)</Label>
                    <Input 
                      placeholder="Kagawad 1 name"
                      value={kagawad1}
                      onChange={(e) => setKagawad1(e.target.value)}
                    />
                    <Input 
                      placeholder="Kagawad 2 name"
                      value={kagawad2}
                      onChange={(e) => setKagawad2(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount Paid (₱)</Label>
                    <Input 
                      id="amount"
                      type="number"
                      placeholder="30"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                    />
                  </div>
                </>
              )}

              {certificateType === "Barangay Clearance" && (
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount Paid (₱)</Label>
                  <Input 
                    id="amount"
                    type="number"
                    placeholder="30"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={handleGenerate}
                disabled={addMutation.isPending}
              >
                {addMutation.isPending ? "Generating..." : "Generate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Certificate No.</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Resident</TableHead>
              <TableHead className="font-medium">Purpose</TableHead>
              <TableHead className="font-medium">Issued Date</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCertificates.map((certificate) => (
              <TableRow key={certificate.id}>
                <TableCell className="font-mono text-sm">{certificate.certificate_no}</TableCell>
                <TableCell>{certificate.certificate_type}</TableCell>
                <TableCell>{certificate.resident_name}</TableCell>
                <TableCell className="max-w-xs truncate">{certificate.purpose}</TableCell>
                <TableCell className="text-sm">
                  {new Date(certificate.issued_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(certificate.status)}>
                    {certificate.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handlePreview(certificate)}
                    >
                      <Eye className="h-4 w-4" />
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

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
            <DialogDescription>
              Preview and print the certificate
            </DialogDescription>
          </DialogHeader>
          {selectedCertificate && (
            <div className="py-4">
              <CertificateTemplates ref={certificateRef} certificate={selectedCertificate} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Download className="h-4 w-4" />
              Print Certificate
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
              Are you sure you want to delete {selectedCertificate?.certificate_no}? This action cannot be undone.
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