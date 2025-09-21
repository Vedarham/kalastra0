import { X, Star, Heart, Share, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  creator: string;
  rating: number;
  category: string;
  description?: string;
  reviews?: number;
  inStock?: boolean;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  if (!product) return null;

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-0 top-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-80 object-cover rounded-lg"
            />
            {discountPercent > 0 && (
              <Badge 
                variant="destructive"
                className="absolute top-2 right-2"
              >
                -{discountPercent}% OFF
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">
                {product.title}
              </h2>
              <p className="text-muted-foreground">
                by <span className="font-medium">{product.creator}</span>
              </p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-marketplace-featured text-marketplace-featured'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews || 24} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-marketplace-price">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg line-through text-muted-foreground">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                {product.description || 
                  "Beautiful handcrafted piece made with traditional techniques and premium materials. Each item is unique and tells its own story of craftsmanship and artistry."
                }
              </p>
            </div>

            <Separator />

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                product.inStock !== false ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm">
                {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => onAddToCart?.(product)}
                disabled={product.inStock === false}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>

            {/* Category Badge */}
            <Badge variant="secondary" className="w-fit">
              {product.category}
            </Badge>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Customer Reviews</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-3 w-3 fill-marketplace-featured text-marketplace-featured"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">Anonymous User</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Beautiful craftsmanship and excellent quality. Highly recommended!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}