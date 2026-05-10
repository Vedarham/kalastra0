import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Share2, Filter, Grid, List, Loader2 } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import { useCart } from "@/contexts/CartContext";
import { getWishlist, toggleWishlist } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await getWishlist();
      setFavorites(res.wishlist || []);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      await toggleWishlist(id);
      setFavorites(favorites.filter(item => item._id !== id));
      toast({
        title: "Removed from favorites",
      });
    } catch (error) {
      toast({
        title: "Error updating favorites",
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item._id,
      title: item.name,
      price: item.price,
      image: item.images?.[0]?.url || "/placeholder.png",
      artisan: item.artisan?.shopName || item.artisan?.name || "Unknown"
    });
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((item) => (
        <Card key={item._id} className="group overflow-hidden hover:shadow-card transition-shadow">
          <div className="relative">
            <img 
              src={item.images?.[0]?.url || "/placeholder.png"} 
              alt={item.name}
              className="w-full h-64 object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500"
              onClick={() => removeFavorite(item._id)}
            >
              <Heart className="h-5 w-5 fill-current" />
            </Button>
            {item.stock <= 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Badge variant="secondary" className="bg-white text-black">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">by {item.artisan?.shopName || item.artisan?.name || "Unknown"}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-primary">${item.price}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                ⭐ {item.rating || 0}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  disabled={item.stock <= 0}
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {favorites.map((item) => (
        <Card key={item._id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative">
                <img 
                  src={item.images?.[0]?.url || "/placeholder.png"} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                {item.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <Badge variant="secondary" className="bg-white text-black text-xs">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-1">by {item.artisan?.shopName || item.artisan?.name || "Unknown"}</p>
                    <div className="text-sm text-muted-foreground mb-2">
                      ⭐ {item.rating || 0}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-primary">${item.price}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFavorite(item._id)}
                      >
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        disabled={item.stock <= 0}
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="text-muted-foreground">{favorites.length} items saved</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : favorites.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start browsing and save items you love!
                </p>
                <Link to="/marketplace">
                  <Button>Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {viewMode === "grid" ? <GridView /> : <ListView />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}