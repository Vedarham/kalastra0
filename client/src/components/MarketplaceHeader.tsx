import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, User, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SellOptionsDialog from "./SellOptionsDialog";
import CartDrawer from "./CartDrawer";
import UserProfileDropdown from "./UserProfileDropdown";
import { useSearch } from "./SearchContext";

import kalastraLogo from '../assets/Kalastra.png';

export default function MarketplaceHeader() {
  const { searchQuery, setSearchQuery, setSearchResults, setIsSearching } = useSearch();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Mock search - filter products by title or category
      const mockData = {
        products: [
          { id: 1, title: "Handmade Terracotta Vase", category: "pottery", price: 45, type: "product" },
          { id: 2, title: "Walnut Wood Spice Box", category: "woodwork", price: 32, type: "product" },
          { id: 3, title: "Bandhani Dupatta", category: "textiles", price: 28, type: "product" },
          { id: 4, title: "Kundan Necklace", category: "jewelry", price: 75, type: "product" },
          { id: 5, title: "Leather Jutti", category: "accessories", price: 65, type: "product" },
        ],
        creators: [
          { id: 1, name: "Ananya Sharma", specialty: "Ceramic Artist", type: "creator" },
          { id: 2, name: "Priya Patel", specialty: "Textile Designer", type: "creator" },
          { id: 3, name: "Rohan Mehta", specialty: "Woodworker", type: "creator" },
          { id: 4, name: "Isha Singh", specialty: "Jewelry Designer", type: "creator" },
        ],
        categories: [
          { id: "pottery", name: "Pottery", icon: "🏺", type: "category" },
          { id: "textiles", name: "Textiles", icon: "🧶", type: "category" },
          { id: "jewelry", name: "Jewelry", icon: "💍", type: "category" },
          { id: "woodwork", name: "Woodwork", icon: "🪵", type: "category" },
          { id: "accessories", name: "Accessories", icon: "👜", type: "category" },
        ],
        collections: [
          { id: 1, name: "Terracotta Collection", creator: "Ananya Sharma", type: "collection" },
          { id: 2, name: "Bandhani Collection", creator: "Priya Patel", type: "collection" },
          { id: 3, name: "Kundan Jewelry Collection", creator: "Isha Singh", type: "collection" },
        ]
      };
      
      const query = searchQuery.toLowerCase();
      const results = [
        ...mockData.products.filter(item => 
          item.title.toLowerCase().includes(query) || 
          item.category.toLowerCase().includes(query)
        ),
        ...mockData.creators.filter(item => 
          item.name.toLowerCase().includes(query) || 
          item.specialty.toLowerCase().includes(query)
        ),
        ...mockData.categories.filter(item => 
          item.name.toLowerCase().includes(query)
        ),
        ...mockData.collections.filter(item => 
          item.name.toLowerCase().includes(query) || 
          item.creator.toLowerCase().includes(query)
        )
      ];
      
      setSearchResults(results);
      setIsSearching(false);
      navigate('/marketplace');
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
              <div className="w-10 h-10 bg-gradient-hero rounded-lg">
                <img src={kalastraLogo} alt="Kalastra Logo" className="w-full h-full object-cover rounded-lg" />
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