import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  Package, 
  HelpCircle, 
  MessageSquare,
  Bell,
  CreditCard 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/api/auth";

export default function UserProfileDropdown() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser } = useAuth()

  const handleLogout = async () => {
    try {
      await logout(); 
      setUser(null); 
      toast({
        title: "Logged out successfully",
      });
      navigate("/auth");
    } catch {
      toast({
        title: "Logout failed",
        variant: "destructive"
      });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!user) {
    return (
      <Button variant="outline" onClick={() =>  navigate("/auth")}>
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.png" alt="Profile" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              JD
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 bg-background border border-border shadow-featured" 
        align="end"
      >
        <DropdownMenuLabel className="p-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              john.doe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigation('/profile')} className="p-3 cursor-pointer">
          <User className="mr-3 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigation('/orders')} className="p-3 cursor-pointer">
          <Package className="mr-3 h-4 w-4" />
          <span>My Orders</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigation('/favorites')} className="p-3 cursor-pointer">
          <Heart className="mr-3 h-4 w-4" />
          <span>Favorites</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigation('/notifications')} className="p-3 cursor-pointer">
          <Bell className="mr-3 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigation('/payment-methods')} className="p-3 cursor-pointer">
          <CreditCard className="mr-3 h-4 w-4" />
          <span>Payment Methods</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigation('/settings')} className="p-3 cursor-pointer">
          <Settings className="mr-3 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigation('/faq')} className="p-3 cursor-pointer">
          <HelpCircle className="mr-3 h-4 w-4" />
          <span>FAQ</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigation('/support')} className="p-3 cursor-pointer">
          <MessageSquare className="mr-3 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="p-3 cursor-pointer text-destructive">
          <LogOut className="mr-3 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}