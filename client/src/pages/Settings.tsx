import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Moon, 
  Sun, 
  Monitor,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile, changePassword, exportUserData } from "@/api/auth";
import { useTheme } from "@/contexts/ThemeContext";

export default function Settings() {
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const { setTheme } = useTheme();
  
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      allowMessages: true
    },
    preferences: {
      language: "en",
      currency: "usd",
      theme: "system"
    }
  });

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        preferences: {
          language: (user as any).preferences?.language || "en",
          currency: (user as any).preferences?.currency || "usd",
          theme: (user as any).preferences?.theme || "system",
        },
        privacy: {
          profileVisible: (user as any).privacy?.profileVisible ?? true,
          showEmail: (user as any).privacy?.showEmail ?? false,
          allowMessages: (user as any).privacy?.allowMessages ?? true,
        }
      }));
    }
  }, [user]);

  const handleSettingChange = async (category: string, key: string, value: boolean | string) => {
    const updatedSettings = {
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [key]: value
      }
    };
    setSettings(updatedSettings);

    if (category === "preferences" && key === "theme") {
      setTheme(value as "light" | "dark" | "system");
    }

    try {
      const res = await updateProfile({
        preferences: updatedSettings.preferences,
        privacy: updatedSettings.privacy
      });
      setUser(res.data.user);
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved"
      });
    } catch (err) {
      toast({
        title: "Error updating settings",
        variant: "destructive"
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    try {
      setIsChangingPassword(true);
      await changePassword(passwordForm);
      toast({ title: "Password changed successfully. Please login again." });
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err: any) {
      toast({ title: err.response?.data?.message || "Failed to change password", variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleExportData = async () => {
    try {
      toast({ title: "Data export started", description: "Downloading your data..." });
      const data = await exportUserData();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `kalastra_data_${user?.name || "export"}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast({ title: "Failed to export data", variant: "destructive" });
    }
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "We've sent you an email with instructions to confirm this action",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and privacy settings
            </p>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about important updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-lg border text-center">
                    <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-medium">Notification Preferences Coming Soon</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      We are currently building our notification system. You'll be able to customize your email and SMS alerts here soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your experience on CraftMarket
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={settings.preferences.language}
                        onValueChange={(value) => handleSettingChange('preferences', 'language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={settings.preferences.currency}
                        onValueChange={(value) => handleSettingChange('preferences', 'currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="inr">INR (₹)</SelectItem>
                          <SelectItem value="cad">CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "light", icon: Sun, label: "Light" },
                        { value: "dark", icon: Moon, label: "Dark" },
                        { value: "system", icon: Monitor, label: "System" }
                      ].map((theme) => {
                        const Icon = theme.icon;
                        return (
                          <Button
                            key={theme.value}
                            variant={settings.preferences.theme === theme.value ? "default" : "outline"}
                            className="flex flex-col gap-2 h-auto p-4"
                            onClick={() => handleSettingChange('preferences', 'theme', theme.value)}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-sm">{theme.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium">Password</Label>
                        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 max-w-sm">
                          <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input 
                              type="password" 
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input 
                              type="password" 
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            />
                          </div>
                          <Button type="submit" disabled={isChangingPassword}>
                            {isChangingPassword ? "Updating..." : "Update Password"}
                          </Button>
                        </form>
                      </div>



                      <Separator />

                      <div>
                        <Label className="text-base font-medium">Active Sessions</Label>
                        <p className="text-sm text-muted-foreground mb-3">
                          Manage devices that are currently logged into your account
                        </p>
                        <Button variant="outline">View Active Sessions</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Methods
                    </CardTitle>
                    <CardDescription>
                      Manage your saved payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Add New Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="data">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Data Export
                    </CardTitle>
                    <CardDescription>
                      Download a copy of your personal data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      You can request a copy of all data associated with your account, including orders, messages, and profile information.
                    </p>
                    <Button onClick={handleExportData} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Request Data Export
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Data Import
                    </CardTitle>
                    <CardDescription>
                      Import your data from another platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Upload a data file from another marketplace to import your order history and preferences.
                    </p>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Import Data
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <Trash2 className="h-5 w-5" />
                      Delete Account
                    </CardTitle>
                    <CardDescription>
                      Permanently delete your account and all associated data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone. All your orders, messages, and profile data will be permanently deleted.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}