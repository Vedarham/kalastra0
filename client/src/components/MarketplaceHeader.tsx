import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SellOptionsDialog from "./SellOptionsDialog";
import CartDrawer from "./CartDrawer";
import UserProfileDropdown from "./UserProfileDropdown";
import { useSearch } from "./SearchContext";
import kalastraLogo from '../assets/Kalastra.jpg';

export default function MarketplaceHeader() {
  const { searchQuery, setSearchQuery} = useSearch();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-20 h-10 border border-black bg-gradient-hero rounded-lg">
                <img src={kalastraLogo} alt="Kalastra Logo" className="w-full h-full object-cover rounded-md" />
              </div>
              <h1 className="text-2xl font-bold text-foreground hidden sm:block">
                Kalastra
              </h1>
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for handmade treasures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-0 bg-muted focus:bg-background transition-colors"
              />
            </div>
          </form>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-6 w-6" />
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="marketplace" className="hidden sm:flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Sell</span>
                </Button>
              </DialogTrigger>
              <SellOptionsDialog />
            </Dialog>
            
            <CartDrawer />
            
            <UserProfileDropdown />
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for handmade treasures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border-0 bg-muted focus:bg-background transition-colors"
            />
          </div>
        </form>
      </div>
    </header>
  );
}