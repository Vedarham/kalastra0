import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Share2, Filter, Grid, List } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import { useCart } from "@/contexts/CartContext";

export default function Favorites() {
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Handwoven Ceramic Bowl",
      price: 45.00,
      originalPrice: 56.25,
      image: "/src/assets/product-ceramic-bowl.jpg",
      seller: "ArtisanCrafts",
      rating: 4.8,
      reviews: 124,
      inStock: true,
      addedDate: "2024-01-10"
    },
    {
      id: 2,
      name: "Macrame Wall Hanging",
      price: 34.99,
      originalPrice: null,
      image: "/src/assets/product-macrame.jpg",
      seller: "BohoCreations",
      rating: 4.9,
      reviews: 89,
      inStock: true,
      addedDate: "2024-01-08"
    },
    {
      id: 3,
      name: "Artisan Jewelry Set",
      price: 125.00,
      originalPrice: 150.00,
      image: "/src/assets/product-jewelry.jpg",
      seller: "CraftedGems",
      rating: 4.7,
      reviews: 67,
      inStock: false,
      addedDate: "2024-01-05"
    },
    {
      id: 4,
      name: "Handmade Basket Set",
      price: 78.50,
      originalPrice: null,
      image: "/src/assets/product-basket.jpg",
      seller: "WeavingWonders",
      rating: 4.6,
      reviews: 43,
      inStock: true,
      addedDate: "2024-01-03"
    }
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const handleAddToCart = (item: typeof favorites[0]) => {
    addToCart({
      id: item.id.toString(),
      title: item.name,
      price: item.price,
      image: item.image,
      artisan: item.seller
    });
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((item) => (
        <Card key={item.id} className="group overflow-hidden hover:shadow-card transition-shadow">
          <div className="relative">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-64 object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500"
              onClick={() => removeFavorite(item.id)}
            >
              <Heart className="h-5 w-5 fill-current" />
            </Button>
            {!item.inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Badge variant="secondary" className="bg-white text-black">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">by {item.seller}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-primary">${item.price}</span>
              {item.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${item.originalPrice}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                ⭐ {item.rating} ({item.reviews})
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  disabled={!item.inStock}
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
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                {!item.inStock && (
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
                    <p className="text-muted-foreground text-sm mb-1">by {item.seller}</p>
                    <div className="text-sm text-muted-foreground mb-2">
                      ⭐ {item.rating} ({item.reviews} reviews)
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Added on {new Date(item.addedDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-primary">${item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFavorite(item.id)}
                      >
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        disabled={!item.inStock}
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
              <h1 className="text-3xl font-bold">My Favorites</h1>
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

          {favorites.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start browsing and save items you love!
                </p>
                <Button>Start Shopping</Button>
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