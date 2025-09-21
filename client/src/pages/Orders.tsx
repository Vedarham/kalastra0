import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Eye, MessageCircle, Star, Filter } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";

export default function Orders() {
  const [orders] = useState([
    {
      id: "ORD001",
      date: "2024-01-15",
      status: "delivered",
      total: 89.99,
      items: [
        {
          name: "Handwoven Ceramic Bowl",
          price: 45.00,
          quantity: 1,
          image: "/src/assets/product-ceramic-bowl.jpg",
          seller: "ArtisanCrafts"
        },
        {
          name: "Macrame Wall Hanging",
          price: 34.99,
          quantity: 1,
          image: "/src/assets/product-macrame.jpg",
          seller: "BohoCreations"
        }
      ]
    },
    {
      id: "ORD002", 
      date: "2024-01-10",
      status: "shipped",
      total: 156.50,
      items: [
        {
          name: "Artisan Jewelry Set",
          price: 125.00,
          quantity: 1,
          image: "/src/assets/product-jewelry.jpg",
          seller: "CraftedGems"
        },
        {
          name: "Handmade Soap Set",
          price: 31.50,
          quantity: 1,
          image: "/placeholder.svg",
          seller: "NaturalSoaps"
        }
      ]
    },
    {
      id: "ORD003",
      date: "2024-01-05", 
      status: "processing",
      total: 67.25,
      items: [
        {
          name: "Wooden Cutting Board",
          price: 67.25,
          quantity: 1,
          image: "/src/assets/product-wooden-board.jpg",
          seller: "WoodworkShop"
        }
      ]
    }
  ]);

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

  const activeOrders = orders.filter(order => ["processing", "shipped"].includes(order.status));
  const pastOrders = orders.filter(order => ["delivered", "cancelled"].includes(order.status));

  const OrderCard = ({ order }: { order: typeof orders[0] }) => (
    <Card className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <p className="text-muted-foreground text-sm">Placed on {new Date(order.date).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
            <p className="text-lg font-semibold mt-1">${order.total}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-4 p-3 bg-muted rounded-lg">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">by {item.seller}</p>
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
              <Button variant="outline" size="sm">
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
                  <OrderCard key={order.id} order={order} />
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
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}