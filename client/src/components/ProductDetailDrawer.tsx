import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Pencil, X, Check, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product.types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "@/api/review";

interface Review {
  _id: string;
  user: { _id: string; name: string; avatar: string };
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

interface ProductDetailDrawerProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StarRating({
  value,
  onChange,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`transition-colors ${readOnly ? "cursor-default" : "cursor-pointer"}`}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => !readOnly && onChange?.(star)}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailDrawer({
  product,
  open,
  onOpenChange,
}: ProductDetailDrawerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const userReview = reviews.find((r) => r.user._id === (user as any)?._id);

  useEffect(() => {
    if (!open || !product) return;
    setReviews([]);
    setTotal(0);
    setEditingId(null);

    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await getProductReviews(product._id);
        setReviews(res.data || []);
        setTotal(res.total || 0);
      } catch {
        /* silent */
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [open, product]);

  if (!product) return null;

  const image = product.images?.[0]?.url || "/placeholder.png";

  const handleAddToCart = () => {
    addToCart({
      id: String(product._id),
      title: product.name,
      price: product.price,
      image,
      artisan: product.artisan?.name || "Unknown",
    });
    toast({ title: "Added to cart!" });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast({ title: "Please write a comment", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await createReview({
        product: product._id,
        rating: newRating,
        title: newTitle.trim() || undefined,
        comment: newComment.trim(),
      });
      setReviews((prev) => [res.data, ...prev]);
      setTotal((t) => t + 1);
      setNewRating(5);
      setNewTitle("");
      setNewComment("");
      toast({ title: "Review submitted!" });
    } catch (err: any) {
      toast({
        title: err.response?.data?.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (review: Review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditTitle(review.title || "");
    setEditComment(review.comment);
  };

  const handleSaveEdit = async (reviewId: string) => {
    setSavingEdit(true);
    try {
      const res = await updateReview(reviewId, {
        rating: editRating,
        title: editTitle.trim() || undefined,
        comment: editComment.trim(),
      });
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? res.data : r))
      );
      setEditingId(null);
      toast({ title: "Review updated!" });
    } catch {
      toast({ title: "Failed to update review", variant: "destructive" });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setTotal((t) => Math.max(0, t - 1));
      toast({ title: "Review deleted" });
    } catch {
      toast({ title: "Failed to delete review", variant: "destructive" });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto p-0"
      >
        {/* Product Hero */}
        <div className="relative">
          <img
            src={image}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className="mb-2 bg-primary/90">{product.category}</Badge>
            <h2 className="text-white text-2xl font-bold leading-tight">
              {product.name}
            </h2>
            <p className="text-white/80 text-sm">
              by {product.artisan?.shopName || product.artisan?.name || "Unknown"}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-marketplace-price">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <StarRating value={product.rating || 0} readOnly />
                <span className="text-sm text-muted-foreground">
                  ({total} review{total !== 1 ? "s" : ""})
                </span>
              </div>
            </div>
            <Button onClick={handleAddToCart} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                About this product
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Reviews Header */}
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <span>Customer Reviews</span>
              <Badge variant="secondary">{total}</Badge>
            </SheetTitle>
          </SheetHeader>

          {/* Write a Review */}
          {user && !userReview && (
            <form
              onSubmit={handleSubmitReview}
              className="bg-muted/40 rounded-xl p-4 space-y-3 border border-border"
            >
              <p className="font-medium text-sm">Write a review</p>
              <StarRating value={newRating} onChange={setNewRating} />
              <input
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Short title (optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={100}
              />
              <Textarea
                placeholder="Share your experience..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                maxLength={1000}
                required
              />
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting ? "Submitting..." : "Post Review"}
              </Button>
            </form>
          )}

          {!user && (
            <p className="text-sm text-muted-foreground text-center py-2">
              <a href="/auth" className="text-primary underline">Log in</a> to write a review.
            </p>
          )}

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">
              No reviews yet. Be the first!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const isOwn = review.user._id === (user as any)?._id;
                const isEditing = editingId === review._id;

                return (
                  <div
                    key={review._id}
                    className="border border-border rounded-xl p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            review.user.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${review.user.name}`
                          }
                          alt={review.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">{review.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {isOwn && !isEditing && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => startEdit(review)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 pt-1">
                        <StarRating value={editRating} onChange={setEditRating} />
                        <input
                          className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Title (optional)"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          maxLength={100}
                        />
                        <Textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          rows={3}
                          maxLength={1000}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(review._id)}
                            disabled={savingEdit}
                            className="gap-1"
                          >
                            <Check className="h-3.5 w-3.5" />
                            {savingEdit ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <StarRating value={review.rating} readOnly />
                        {review.title && (
                          <p className="font-medium text-sm">{review.title}</p>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
