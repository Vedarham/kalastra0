import { Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  creator: string;
  rating: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group hover:shadow-card transition-all duration-200 hover:scale-[1.02]">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Product Image */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover rounded-md"
            />
            {discountPercent > 0 && (
              <Badge 
                variant="destructive"
                className="absolute -top-1 -right-1 text-xs px-1"
              >
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm line-clamp-2 text-card-foreground">
              {product.title}
            </h4>
            <p className="text-xs text-muted-foreground mb-1">
              by {product.creator}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3 w-3 fill-marketplace-featured text-marketplace-featured" />
              <span className="text-xs text-muted-foreground">{product.rating}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-marketplace-price">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs line-through text-muted-foreground">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onViewDetails && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(product)}
                  className="h-7 px-2 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              )}
              {onAddToCart && (
                <Button
                  size="sm"
                  onClick={() => onAddToCart(product)}
                  className="h-7 px-2 text-xs"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}