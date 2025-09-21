import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Package, Heart, MessageCircle, ShoppingCart, Star, Mail } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "order",
      title: "Order Shipped",
      message: "Your order #ORD002 has been shipped and is on its way!",
      time: "2 hours ago",
      read: false,
      icon: Package
    },
    {
      id: "2", 
      type: "favorite",
      title: "Price Drop Alert",
      message: "Handwoven Ceramic Bowl you favorited is now 20% off!",
      time: "1 day ago",
      read: false,
      icon: Heart
    },
    {
      id: "3",
      type: "message",
      title: "New Message",
      message: "ArtisanCrafts replied to your inquiry about custom pottery.",
      time: "2 days ago",
      read: true,
      icon: MessageCircle
    },
    {
      id: "4",
      type: "order",
      title: "Order Delivered",
      message: "Your order #ORD001 has been delivered. Rate your experience!",
      time: "3 days ago",
      read: true,
      icon: Package
    },
    {
      id: "5",
      type: "cart",
      title: "Items in Cart",
      message: "You have 3 items waiting in your cart. Complete your purchase!",
      time: "1 week ago",
      read: true,
      icon: ShoppingCart
    },
    {
      id: "6",
      type: "review",
      title: "Review Request",
      message: "How was your experience with WoodworkShop? Leave a review!",
      time: "1 week ago",
      read: true,
      icon: Star
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order": return "bg-blue-100 text-blue-800";
      case "favorite": return "bg-red-100 text-red-800";
      case "message": return "bg-green-100 text-green-800";
      case "cart": return "bg-yellow-100 text-yellow-800";
      case "review": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const NotificationCard = ({ notification }: { notification: typeof notifications[0] }) => {
    const IconComponent = notification.icon;
    
    return (
      <Card className={`mb-3 cursor-pointer transition-colors ${!notification.read ? 'bg-primary/5 border-primary/20' : ''}`}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium">{notification.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                  {!notification.read && (
                    <Badge variant="secondary" className="h-2 w-2 p-0 bg-primary"></Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
              {!notification.read && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                  }}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Notifications</h1>
              {unreadNotifications.length > 0 && (
                <Badge variant="secondary">
                  {unreadNotifications.length} new
                </Badge>
              )}
            </div>
            {unreadNotifications.length > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadNotifications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {notifications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No notifications</h3>
                    <p className="text-muted-foreground">We'll notify you when something important happens!</p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>

            <TabsContent value="unread">
              {unreadNotifications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">No unread notifications at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                unreadNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}