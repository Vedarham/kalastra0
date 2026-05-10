import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import PaymentOptions from "./PaymentOptions";
import { createOrder } from "@/api/order";
import { useToast } from "@/hooks/use-toast";

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const [step, setStep] = useState<"cart" | "shipping" | "payment">("cart");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const [shipping, setShipping] = useState({
    fullName: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: ""
  });

  const subtotal = getTotalPrice();
  const gstRate = 0.18;
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingOrder(true);
    try {
      const orderData = {
        items: items.map(i => ({ product: i.id, quantity: i.quantity })),
        shippingAddress: shipping,
        pricing: {
          subtotal,
          tax: gstAmount,
          discount: 0,
          total
        },
        payment: { method: "stripe" }
      };

      const res = await createOrder(orderData);
      setOrderId(res.data.order._id);
      setStep("payment");
    } catch (error: any) {
      toast({
        title: "Error creating order",
        description: error.response?.data?.message || error.message,
        variant: "destructive"
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const resetDrawer = () => {
    setStep("cart");
    setOrderId(null);
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetDrawer();
    }}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {getTotalItems() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            {step === "cart" && <><ShoppingCart className="h-5 w-5" /> Your Cart ({getTotalItems()} items)</>}
            {step === "shipping" && <><ArrowLeft className="h-5 w-5 cursor-pointer" onClick={() => setStep("cart")} /> Shipping Details</>}
            {step === "payment" && <>Complete Payment</>}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="flex flex-col flex-1 min-h-0">
          
          {step === "cart" && (
            <ScrollArea className="flex-1 px-4 max-h-[40vh]">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-card rounded-lg border">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">by {item.artisan}</p>
                        <p className="font-semibold text-marketplace-price">${item.price}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}

          {step === "shipping" && (
            <ScrollArea className="flex-1 px-4 max-h-[50vh]">
              <form id="shipping-form" onSubmit={handleCreateOrder} className="space-y-4 p-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" required value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" required value={shipping.addressLine1} onChange={e => setShipping({...shipping, addressLine1: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" required value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" required value={shipping.postalCode} onChange={e => setShipping({...shipping, postalCode: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" required value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} />
                  </div>
                </div>
              </form>
            </ScrollArea>
          )}

          {/* Invoice Summary & Actions */}
          {items.length > 0 && (
            <div className="flex-shrink-0 border-t bg-card p-4 space-y-4">
              {step === "payment" && orderId ? (
                <PaymentOptions 
                  orderId={orderId}
                  total={total}
                  onBack={() => setStep("cart")}
                  onSuccess={() => setIsOpen(false)}
                />
              ) : (
                <>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST (18%):</span>
                      <span>${gstAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-marketplace-price">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {step === "cart" && (
                    <Button 
                      className="w-full" 
                      onClick={() => setStep("shipping")}
                      disabled={items.length === 0}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  )}

                  {step === "shipping" && (
                    <Button 
                      type="submit"
                      form="shipping-form"
                      className="w-full" 
                      disabled={isCreatingOrder}
                    >
                      {isCreatingOrder ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                      {isCreatingOrder ? "Creating Order..." : "Continue to Payment"}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}