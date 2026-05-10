import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Eye, MessageCircle, Star, Filter } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import { getMyOrders } from "@/api/order";
import { createReview } from "@/api/review";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [reviewItem, setReviewItem] = useState<any | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
 
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered": return "Delivered";
      case "shipped": return "Shipped";
      case "processing": return "Processing";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrder || !reviewItem) return;
    try {
      setIsSubmittingReview(true);
      await createReview({
        product: reviewItem.product?._id || reviewItem.product,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        orderId: reviewOrder._id,
      });
      toast({ title: "Review submitted successfully!" });
      setReviewOrder(null);
      setReviewItem(null);
      setReviewForm({ rating: 5, title: "", comment: "" });
    } catch (err: any) {
      toast({ title: err.response?.data?.message || "Failed to submit review", variant: "destructive" });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const activeOrders = orders.filter(order => ["processing", "shipped"].includes(order.status));
  const pastOrders = orders.filter(order => ["delivered", "cancelled"].includes(order.status));

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.orderNumber || order._id}</CardTitle>
            <p className="text-muted-foreground text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
            <p className="text-lg font-semibold mt-1">${order.pricing?.total || 0}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex gap-4 p-3 bg-muted rounded-lg">
              <img 
                src={item.image || "/placeholder.png"} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">by {item.seller?.shopName || item.seller?.name || "Unknown"}</p>
                <p className="text-sm">Qty: {item.quantity} × ${item.price}</p>
              </div>
            </div>
          ))}
          
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
            {order.status === "delivered" && (
              <Button variant="outline" size="sm" onClick={() => { setReviewOrder(order); setReviewItem(item); }}>
                <Star className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Active Orders ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Orders ({pastOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeOrders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No active orders</h3>
                    <p className="text-muted-foreground">Start shopping to see your orders here!</p>
                  </CardContent>
                </Card>
              ) : (
                activeOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastOrders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No past orders</h3>
                    <p className="text-muted-foreground">Your order history will appear here.</p>
                  </CardContent>
                </Card>
              ) : (
                pastOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={!!reviewItem} onOpenChange={() => { setReviewItem(null); setReviewOrder(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          {reviewItem && (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <img 
                  src={reviewItem.image || "/placeholder.png"} 
                  alt={reviewItem.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <h4 className="font-medium text-sm">{reviewItem.name}</h4>
              </div>
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${star <= reviewForm.rating ? "fill-marketplace-featured text-marketplace-featured" : "text-muted-foreground"}`}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  placeholder="Review title" 
                  value={reviewForm.title} 
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Comment</Label>
                <Textarea 
                  placeholder="Share your experience..." 
                  value={reviewForm.comment} 
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} 
                  rows={4} 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmittingReview}>
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}