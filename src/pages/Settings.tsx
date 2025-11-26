import { useState, useEffect } from "react";
import { Save, Key, UserPlus, Trash2, Shield } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, signOut, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // User management state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "staff" | "read_only">("staff");
  const [editUserRole, setEditUserRole] = useState<"admin" | "staff" | "read_only">("staff");

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

  // Fetch all users with their roles
  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['all_users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);
          
          if (rolesError) throw rolesError;
          
          return {
            ...profile,
            roles: roles.map(r => r.role),
          };
        })
      );

      return usersWithRoles;
    },
    enabled: isAdmin,
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

  // Add new user
  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserFullName) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // This would typically be done via an admin function
      toast.info('New users need to sign up via the auth page. You can then assign them roles here.');
      setIsAddUserOpen(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserFullName("");
      setNewUserRole("staff");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Update user role
  const handleUpdateUserRole = async () => {
    if (!selectedUserId) return;

    try {
      // First, remove existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', selectedUserId);

      // Then add new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUserId,
          role: editUserRole,
        });

      if (error) throw error;

      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['all_users'] });
      setIsEditUserOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;

      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['all_users'] });
    } catch (error: any) {
      toast.error('Unable to delete user. Admin API access required.');
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
        <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="barangay">Barangay Info</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
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

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6">
          {!isAdmin ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">You need admin privileges to manage users.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usersLoading ? (
                      <p className="text-sm text-muted-foreground">Loading users...</p>
                    ) : allUsers && allUsers.length > 0 ? (
                      allUsers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <p className="font-medium">{u.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {u.full_name || 'No name'} • {u.roles.length > 0 ? u.roles.join(', ') : 'No role assigned'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Dialog open={isEditUserOpen && selectedUserId === u.id} onOpenChange={(open) => {
                              setIsEditUserOpen(open);
                              if (open) {
                                setSelectedUserId(u.id);
                                setEditUserRole(u.roles[0] || 'staff');
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Shield className="h-4 w-4 mr-2" />
                                  Edit Role
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit User Role</DialogTitle>
                                  <DialogDescription>Change the role for {u.email}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select value={editUserRole} onValueChange={(value: any) => setEditUserRole(value)}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                        <SelectItem value="read_only">Read Only</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
                                  <Button onClick={handleUpdateUserRole}>Update Role</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            {u.id !== user?.id && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {u.email}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(u.id)} className="bg-destructive text-destructive-foreground">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No users found.</p>
                    )}
                    
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add New User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                          <DialogDescription>
                            Note: New users must sign up via the auth page. Use this to document expected users.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-email">Email</Label>
                            <Input 
                              id="new-email"
                              type="email"
                              value={newUserEmail}
                              onChange={(e) => setNewUserEmail(e.target.value)}
                              placeholder="user@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-fullname">Full Name</Label>
                            <Input 
                              id="new-fullname"
                              value={newUserFullName}
                              onChange={(e) => setNewUserFullName(e.target.value)}
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">Password</Label>
                            <Input 
                              id="new-password"
                              type="password"
                              value={newUserPassword}
                              onChange={(e) => setNewUserPassword(e.target.value)}
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Default Role</Label>
                            <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="read_only">Read Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                          <Button onClick={handleAddUser}>Add User</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>Define permissions for different user roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-border rounded-lg">
                <p className="font-medium">Admin</p>
                <p className="text-sm text-muted-foreground">Full access to all features</p>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <p className="font-medium">Staff</p>
                <p className="text-sm text-muted-foreground">Can manage residents and generate certificates</p>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <p className="font-medium">Read-Only</p>
                <p className="text-sm text-muted-foreground">Can only view data, cannot make changes</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Preferences Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose your display theme</p>
                </div>
                <Button variant="outline">Light</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">Select system language</p>
                </div>
                <Button variant="outline">English</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Timezone</p>
                  <p className="text-sm text-muted-foreground">Set your timezone</p>
                </div>
                <Button variant="outline">GMT+8</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Backup and restore your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                Backup Database
              </Button>
              <Button variant="outline" className="w-full">
                Restore Database
              </Button>
              <Button variant="outline" className="w-full text-destructive">
                Reset All Data
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
