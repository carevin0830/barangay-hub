import { useState, useEffect } from "react";
import { Save, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, signOut, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Profile state
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Barangay settings state
  const [barangayName, setBarangayName] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [province, setProvince] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [barangayEmail, setBarangayEmail] = useState("");

  // Fetch profile data
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch barangay settings
  const { data: barangaySettings } = useQuery({
    queryKey: ['barangay_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('barangay_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });


  // Update profile state when data loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPosition(profile.position || "");
      setPhoneNumber(profile.phone_number || "");
    }
  }, [profile]);

  // Update barangay settings state when data loads
  useEffect(() => {
    if (barangaySettings) {
      setBarangayName(barangaySettings.barangay_name || "");
      setMunicipality(barangaySettings.municipality || "");
      setProvince(barangaySettings.province || "");
      setAddress(barangaySettings.address || "");
      setContactNumber(barangaySettings.contact_number || "");
      setBarangayEmail(barangaySettings.email || "");
    }
  }, [barangaySettings]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (!user?.id) throw new Error('No user');
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Update barangay settings mutation
  const updateBarangayMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (!barangaySettings?.id) throw new Error('No settings found');
      const { error } = await supabase
        .from('barangay_settings')
        .update(updates)
        .eq('id', barangaySettings.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barangay_settings'] });
      toast.success('Barangay settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      full_name: fullName,
      position: position,
      phone_number: phoneNumber,
    });
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    }
  };

  const handleSaveBarangay = () => {
    if (!barangaySettings?.id) {
      // Create new barangay settings if none exist
      supabase
        .from('barangay_settings')
        .insert({
          barangay_name: barangayName,
          municipality: municipality,
          province: province,
          address: address,
          contact_number: contactNumber,
          email: barangayEmail,
        })
        .then(({ error }) => {
          if (error) {
            toast.error(error.message);
          } else {
            toast.success('Barangay settings created successfully');
            queryClient.invalidateQueries({ queryKey: ['barangay_settings'] });
          }
        });
    } else {
      updateBarangayMutation.mutate({
        barangay_name: barangayName,
        municipality: municipality,
        province: province,
        address: address,
        contact_number: contactNumber,
        email: barangayEmail,
      });
    }
  };



  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, barangay information, and system preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="barangay">Barangay Info</TabsTrigger>
        </TabsList>

        {/* Profile Settings Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  placeholder="e.g., Barangay Captain, Secretary"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleChangePassword}
              >
                <Key className="h-4 w-4" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Barangay Information Tab */}
        <TabsContent value="barangay" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Barangay Information</CardTitle>
              <CardDescription>Manage your barangay details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="barangayName">Barangay Name</Label>
                <Input 
                  id="barangayName" 
                  placeholder="Enter barangay name"
                  value={barangayName}
                  onChange={(e) => setBarangayName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="municipality">Municipality/City</Label>
                <Input 
                  id="municipality" 
                  placeholder="Enter municipality or city"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="province">Province</Label>
                <Input 
                  id="province" 
                  placeholder="Enter province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barangayAddress">Address</Label>
                <Textarea 
                  id="barangayAddress" 
                  placeholder="Complete barangay address" 
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input 
                  id="contactNumber" 
                  type="tel" 
                  placeholder="Barangay contact number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barangayEmail">Email Address</Label>
                <Input 
                  id="barangayEmail" 
                  type="email" 
                  placeholder="Official barangay email"
                  value={barangayEmail}
                  onChange={(e) => setBarangayEmail(e.target.value)}
                />
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={handleSaveBarangay}
                disabled={updateBarangayMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {updateBarangayMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
