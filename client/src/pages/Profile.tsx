import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Camera, MapPin, Mail, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import { logout } from "@/api/auth";

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const {user, setUser, loadUser} = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: {
      city: "",
      state: "",
      country: "",
    },
    bio: "",
  });

  const [editFormData, setEditFormData] = useState(formData);

  useEffect(() => {
    if (!user) return;

  const data = {
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    location: {
      city: user.location?.city ?? "",
      state: user.location?.state ?? "",
      country: user.location?.country ?? "",
    },
    bio: user.bio ?? "",
  };

  setFormData(data);
  setEditFormData(data);
}, [user]);

  const handleSave = async () => {
  try {
    await api.put("/auth/me", editFormData);
    await loadUser();
    setIsEditing(false);
    toast({ title: "Profile updated", description: "Saved successfully" });
  } catch {
    toast({ title: "Update failed", description: "Try again", variant: "destructive" });
  }
  };

  const handleCancel = () => {
    setEditFormData(formData);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    await api.put("/users/avatar", formData,{
      headers: { "Content-Type": "multipart/form-data" },
    });

    await loadUser();

    toast({ title: "Avatar updated" });
  } catch {
    toast({
      title: "Upload failed",
      variant: "destructive"
      });
    }
  };

  const stats = [
    { label: "Orders", value: 24 },
    { label: "Favorites", value: 156 },
    { label: "Reviews", value: 18 },
    { label: "Following", value: 45 }
  ];

  const handleLogout = async () => {
  try {
    await logout();
    setUser(null);
    window.location.href = "/auth";
  } catch {
    toast({ title: "Logout failed", variant: "destructive" });
  }
};

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await api.delete("/users/delete");
      window.location.href = "/auth";
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-soft">
                    <AvatarImage src= {user?.avatar} alt="Profile" />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="avatarUpload"
                      onChange={handleAvatarUpload}
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full"
                      onClick={() => document.getElementById("avatarUpload")?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">{formData.name}</h1>
                      <div className="flex items-center gap-4 text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{formData.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">
                            {[
                              formData.location.city,
                              formData.location.state,
                              formData.location.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Member since {formData.memberSince}
                      </Badge>
                    </div> */}
                  </div>
                  
                  <p className="text-muted-foreground">{formData.bio}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Personal Details</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        />
                      ) : (
                        <div className="p-3 bg-muted rounded-md">{formData.name}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        />
                      ) : (
                        <div className="p-3 bg-muted rounded-md">{formData.email}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                        />
                      ) : (
                        <div className="p-3 bg-muted rounded-md">{formData.phone}</div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input
                          value={editFormData.location.city}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              location: {
                                ...editFormData.location,
                                city: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>State</Label>
                        <Input
                          value={editFormData.location.state}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              location: {
                                ...editFormData.location,
                                state: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Country</Label>
                        <Input
                          value={editFormData.location.country}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              location: {
                                ...editFormData.location,
                                country: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        rows={4}
                        value={editFormData.bio}
                        onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">{formData.bio}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your shopping and notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Notification Preferences</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span>Email notifications for new messages</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span>SMS notifications for order updates</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Marketing emails</span>
                        </label>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3">Shopping Preferences</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span>Save items to favorites automatically</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Show recommended items</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Button variant="outline">Change Password</Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Last changed 3 months ago
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-3">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Add an extra layer of security to your account</p>
                        <p className="text-xs text-muted-foreground">Status: Not enabled</p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-3 text-destructive">Danger Zone</h4>
                    <div className="space-y-3">
                      <Button
                          variant="outline"
                          className="text-destructive border-destructive"
                          onClick={handleDeleteAccount}
                        >
                          Delete Account
                        </Button>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}