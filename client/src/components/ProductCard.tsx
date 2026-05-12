import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import { Product } from "@/types/product.types";
import { useAuth } from "@/contexts/AuthContext";

interface ProductCardProps {
  product: Product;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onProductClick?: (product: Product) => void;
}

export default function ProductCard({
  product,
  isFavorited = false,
  onFavoriteToggle,
  onAddToCart,
  onProductClick,
}: ProductCardProps) {
  const { user } = useAuth();
  if (!product) return null;

  const { _id, name, price, images, artisan, rating = 0, numReviews = 0 } = product;
  const image = images?.[0]?.url || "/placeholder.png";

  return (
    <Card
      className="group overflow-hidden bg-card shadow-card hover:shadow-featured transition-all duration-300 border-0 cursor-pointer flex flex-col h-full"
      onClick={() => onProductClick?.(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background text-foreground hover:text-primary disabled:opacity-50"
          disabled={user?._id === (artisan?._id || artisan)}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.(_id);
          }}
        >
          <Heart
            className={`h-5 w-5 ${isFavorited ? "fill-primary text-primary" : ""}`}
          />
        </Button>
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1 space-y-3">
        <div className="flex-1">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">
              by {artisan?.shopName || artisan?.name || "Unknown"}
            </p>
            {product.seoTags && product.seoTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {product.seoTags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-[10px] bg-secondary/50 text-secondary-foreground px-1.5 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {/* Rating + Review count */}
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-foreground">
              {rating > 0 ? rating.toFixed(1) : "—"}
            </span>
            <span className="text-sm text-muted-foreground">
              ({numReviews} review{numReviews !== 1 ? "s" : ""})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-marketplace-price">
              ₹{price.toLocaleString("en-IN")}
            </span>
          </div>

          <Button
            variant="marketplace"
            className="w-full"
            disabled={user?._id === (artisan?._id || artisan)}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(_id);
            }}
          >
            {user?._id === (artisan?._id || artisan) ? "Your Product" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Card>
  );
}