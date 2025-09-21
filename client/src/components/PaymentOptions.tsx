import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Smartphone, CreditCard, Building2, Wallet, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

interface PaymentOptionsProps {
  total: number;
  onBack: () => void;
}

const paymentMethods = [
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    description: 'Pay using UPI apps like GPay, PhonePe, Paytm',
    popular: true
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, RuPay cards accepted'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: Building2,
    description: 'All major banks supported'
  },
  {
    id: 'wallet',
    name: 'Digital Wallets',
    icon: Wallet,
    description: 'Paytm, PhonePe, Amazon Pay, etc.'
  }
];

export default function PaymentOptions({ total, onBack }: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { clearCart } = useCart();

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      clearCart();
      toast({
        title: "Payment Successful!",
        description: `Payment of $${total.toFixed(2)} completed successfully`,
      });
      onBack();
    }, 2000);
  };

  return (
    <div className="space-y-4 max-h-[50vh] overflow-y-auto">
      <div className="flex items-center gap-2 sticky top-0 bg-background pb-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">Choose Payment Method</h3>
      </div>
      
      <div className="space-y-3 px-1">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card 
              key={method.id}
              className={`cursor-pointer transition-all hover:shadow-soft ${
                selectedMethod === method.id ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{method.name}</span>
                      {method.popular && (
                        <span className="text-xs bg-marketplace-featured text-white px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="sticky bottom-0 bg-background pt-2">
        <Separator className="mb-4" />
      
        <div className="flex justify-between items-center text-lg font-semibold mb-4">
          <span>Total Amount:</span>
          <span className="text-marketplace-price">${total.toFixed(2)}</span>
        </div>
      
        <Button 
          className="w-full" 
          onClick={handlePayment}
          disabled={!selectedMethod || processing}
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </Button>
      </div>
    </div>
  );
}