import { useState } from "react";
import { Save, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

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
                  defaultValue="cortezroxxanne700@gmail.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Enter your full name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" placeholder="e.g., Barangay Captain, Secretary" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter your phone number" />
              </div>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Save className="h-4 w-4" />
                Save Changes
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
                <Input id="currentPassword" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button variant="outline" className="gap-2">
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
                <Input id="barangayName" placeholder="Enter barangay name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="municipality">Municipality/City</Label>
                <Input id="municipality" placeholder="Enter municipality or city" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="province">Province</Label>
                <Input id="province" placeholder="Enter province" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barangayAddress">Address</Label>
                <Textarea id="barangayAddress" placeholder="Complete barangay address" rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input id="contactNumber" type="tel" placeholder="Barangay contact number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barangayEmail">Email Address</Label>
                <Input id="barangayEmail" type="email" placeholder="Official barangay email" />
              </div>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">cortezroxxanne700@gmail.com</p>
                    <p className="text-sm text-muted-foreground">Admin User</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive">Remove</Button>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Add New User
                </Button>
              </div>
            </CardContent>
          </Card>

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
    </div>
  );
};

export default Settings;
