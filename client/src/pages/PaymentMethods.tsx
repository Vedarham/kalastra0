import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Plus, Trash2, Edit, Shield } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import { createPayment } from "@/api/payment";
import { PaymentMethod, NewCardForm, EMPTY_CARD } from "@/types/payment.types";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// NO GST and CORRECT THE LOADING STATE IN THE CHECKOUT PAGE
// ALSO WHAT DOES WEBHOOK DOES 

export default function PaymentMethods() {
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newCard, setNewCard] = useState<NewCardForm>(EMPTY_CARD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderId = new URLSearchParams(window.location.search).get("orderId") ?? "";

  const handleAddCard = async () => {
    setLoading(true);
    setError(null);
    if(!newCard.cardNumber || !newCard.name || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try{
      const {data} = await createPayment(orderId);
      const {clientSecret} = data;
      const stripe = await stripePromise;
      if(!stripe) {
        setError("Stripe failed to initialize");
        setLoading(false);
        return;
      }

      const {error:stripeError, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: newCard.cardNumber,
            exp_month: parseInt(newCard.expiryMonth),
            exp_year: parseInt(newCard.expiryYear),
            cvc: newCard.cvv,
          },
          billing_details: {
            name: newCard.name,
          },
        },
      });

      if(stripeError) {
        setError(stripeError.message || "Payment failed");
        setLoading(false);
        return;
      }

      if(paymentIntent && paymentIntent.status === "succeeded") {
        // In a real app, you would fetch the updated payment methods from the server here
        setPaymentMethods((prev) => [
          ...prev,
          {
            id: paymentIntent.id,
            brand: "Visa", // This should come from Stripe's response in a real app
            last4: newCard.cardNumber.slice(-4),
            expiryMonth: parseInt(newCard.expiryMonth),
            expiryYear: parseInt(newCard.expiryYear),
            isDefault: prev.length === 0, // Set as default if it's the first card
          },
        ]);
        setNewCard(EMPTY_CARD);
      } else {
        setError("Payment failed");
      }
    }catch{
      setError("An error occurred while processing your payment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
      setPaymentMethods((prev) => {
        const filtered = prev.filter((m) => m.id !== id);
        if (filtered.length > 0 && !filtered.some((m) => m.isDefault)) {
          filtered[0].isDefault = true;
        }
        return filtered;
      });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({ ...method, isDefault: method.id === id }))
    );
  };

  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      default:
        return "💳";
      };
    };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Payment Methods</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Card</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={newCard.cardNumber}
                      onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={newCard.name}
                      onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Input
                        id="expiryMonth"
                        placeholder="MM"
                        value={newCard.expiryMonth}
                        onChange={(e) => setNewCard({...newCard, expiryMonth: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Year</Label>
                      <Input
                        id="expiryYear"
                        placeholder="YYYY"
                        value={newCard.expiryYear}
                        onChange={(e) => setNewCard({...newCard, expiryYear: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={newCard.cvv}
                        onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddCard} className="w-full">
                    Add Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                  <p className="text-muted-foreground mb-4">Add a payment method to start shopping!</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Payment Method</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Card</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={newCard.cardNumber}
                            onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Cardholder Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={newCard.name}
                            onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="expiryMonth">Month</Label>
                            <Input
                              id="expiryMonth"
                              placeholder="MM"
                              value={newCard.expiryMonth}
                              onChange={(e) => setNewCard({...newCard, expiryMonth: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="expiryYear">Year</Label>
                            <Input
                              id="expiryYear"
                              placeholder="YYYY"
                              value={newCard.expiryYear}
                              onChange={(e) => setNewCard({...newCard, expiryYear: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={newCard.cvv}
                              onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddCard} className="w-full">
                          Add Card
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              paymentMethods.map((method) => (
                <Card key={method.id} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getBrandIcon(method.brand)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {method.brand} •••• {method.last4}
                            </span>
                            {method.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!method.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {paymentMethods.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Your payment information is encrypted and stored securely</p>
                  <p>• We never store your full card number or CVV</p>
                  <p>• All transactions are processed through secure payment gateways</p>
                  <p>• You can remove payment methods at any time</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}