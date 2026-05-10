import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { createPayment } from "@/api/payment";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

interface PaymentOptionsProps {
  total: number;
  orderId: string;
  currency?: "INR" | "USD";
  onBack: () => void;
  onSuccess?: () => void;
}

// ─── Inner form — must live inside <Elements> ─────────────────────────────────
function StripeCardForm({
  orderId,
  total,
  currency,
  onSuccess,
  onError,
}: {
  orderId: string;
  total: number;
  currency: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  const symbol = currency === "INR" ? "₹" : "$";

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setBusy(true);
    try {
      const { data } = await createPayment(orderId);
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element not mounted");

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (error) throw new Error(error.message);
      if (paymentIntent?.status === "succeeded") {
        onSuccess();
      } else {
        throw new Error("Payment incomplete. Status: " + paymentIntent?.status);
      }
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stripe hosted card input */}
      <div className="rounded-md border px-3 py-3 bg-background">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "15px",
                color: "hsl(var(--foreground))",
                fontFamily: "inherit",
                "::placeholder": { color: "hsl(var(--muted-foreground))" },
              },
              invalid: { color: "hsl(var(--destructive))" },
            },
          }}
        />
      </div>

      <Button className="w-full" size="lg" onClick={handlePay} disabled={busy || !stripe}>
        {busy ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </span>
        ) : (
          `Pay ${symbol}${total.toFixed(2)}`
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Secured by Stripe — your card details never touch our servers
      </div>
    </div>
  );
}

// ─── Wrapper with <Elements> provider ────────────────────────────────────────
export default function PaymentOptions({
  total,
  orderId,
  currency = "INR",
  onBack,
  onSuccess,
}: PaymentOptionsProps) {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { clearCart } = useCart();
  const symbol = currency === "INR" ? "₹" : "$";

  const handleSuccess = () => {
    clearCart();
    toast({ title: "Payment Successful!", description: "Your order has been confirmed." });
    onSuccess?.();
    onBack();
  };

  const handleError = (msg: string) => {
    setError(msg);
    toast({ title: "Payment Failed", description: msg, variant: "destructive" });
  };

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 sticky top-0 bg-background pb-2 z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">Card Payment</h3>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/10 text-destructive text-sm p-3">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center text-base font-semibold px-1">
        <span>Total</span>
        <span>{symbol}{total.toFixed(2)}</span>
      </div>
      <Separator />

      {/* Stripe form */}
      <Elements stripe={stripePromise}>
        <StripeCardForm
          orderId={orderId}
          total={total}
          currency={currency}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </Elements>
    </div>
  );
}