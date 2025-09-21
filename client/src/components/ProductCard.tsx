import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  artisan: string;
  rating: number;
  reviewCount: number;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export default function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  artisan,
  rating,
  reviewCount,
  isFavorited = false,
  onFavoriteToggle,
  onAddToCart,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className="group overflow-hidden bg-card shadow-card hover:shadow-featured transition-all duration-300 border-0">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background text-foreground hover:text-primary"
          onClick={() => onFavoriteToggle?.(id)}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-primary text-primary' : ''}`} />
        </Button>
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
            -{discount}%
          </Badge>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">by {artisan}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-marketplace-featured text-marketplace-featured" />
            <span className="text-sm font-medium text-foreground">{rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-marketplace-price">
              ${price}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>
        
        <Button 
          variant="marketplace" 
          className="w-full" 
          onClick={() => onAddToCart?.(id)}
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}