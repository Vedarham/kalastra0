import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}
export default function ProductCard({
  product,
  isFavorited = false,
  onFavoriteToggle,
  onAddToCart,
}: ProductCardProps) {
  if (!product) return null;
  const {
    _id,
    name,
    price,
    images,
    artisan,
    rating = 0,
    numReviews = 0,
  } = product;

  const image = images?.[0]?.url || "/placeholder.png";
  return (
    <Card className="group overflow-hidden bg-card shadow-card hover:shadow-featured transition-all duration-300 border-0">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background text-foreground hover:text-primary"
          onClick={(e) =>{ 
            e.stopPropagation();
            onFavoriteToggle?.(_id)
          }}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-primary text-primary' : ''}`} />
        </Button>
        {/* {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
            -{discount}%
          </Badge>
        )} */}
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">by {artisan?.shopName || artisan?.name || "Unknown"}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-marketplace-featured text-marketplace-featured" />
            <span className="text-sm font-medium text-foreground">{rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({numReviews})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-marketplace-price">
            ₹{price}
          </span>
        </div>
        
        <Button 
          variant="marketplace" 
          className="w-full" 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(_id)
          }}
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}