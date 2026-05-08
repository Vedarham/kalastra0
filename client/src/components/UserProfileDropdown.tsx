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
  CreditCard, 
  Store,
  Handshake
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { becomeArtisan, logout } from "@/api/auth";

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

  const handleBecomeArtisan = async () => {
    try {
      const res = await becomeArtisan();

      setUser(res.user);

      toast({
        title: "You're now an artisan 🎨",
        description: "Start selling your creations!",
      });

      navigate("/seller/dashboard");
    } catch {
      toast({
        title: "Failed to switch role",
        variant: "destructive",
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

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("")
    : "NA";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || ""} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
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
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
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


        {/* SELLER FEATURES */}
        {user.role === "seller" && (
          <>
            <DropdownMenuItem onClick={() => handleNavigation("/seller/dashboard")} className="p-3 cursor-pointer">
              <Store className="mr-3 h-4 w-4" />
              <span>Seller Dashboard</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleNavigation("/seller/products")} className="p-3 cursor-pointer">
              <Package className="mr-3 h-4 w-4" />
              <span>My Products</span>
            </DropdownMenuItem>
          </>
        )}
        
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

        {user.role !== "seller" &&
        <DropdownMenuItem onClick={handleBecomeArtisan} className="p-3 cursor-pointer">
          <Handshake className="mr-3 h-4 w-4" />
          <span>Become an Artisan</span>
        </DropdownMenuItem>}
        
        <DropdownMenuItem onClick={handleLogout} className="p-3 cursor-pointer text-destructive">
          <LogOut className="mr-3 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}