import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendOtp, verifyOtp } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function SellerVerify() {
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await sendOtp();
      setSent(true);
      toast({ title: "OTP sent to your email" });
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to send OTP";

      if (status === 429) {
        // OTP already exists and is still valid — show input so user can verify
        setSent(true);
        toast({ title: "OTP already sent — check your email and enter the code below." });
      } else {
        toast({ title: message, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      toast({ title: "Please enter the OTP", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(otp.trim());
      await loadUser();
      toast({ title: "Verification successful 🎉" });
      navigate("/seller/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Verification failed";
      toast({ title: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Verify Your Artisan Account
        </h2>

        {!sent ? (
          <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending…" : "Send OTP"}
          </Button>
        ) : (
          <>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              inputMode="numeric"
            />
            <Button className="w-full" onClick={handleVerify} disabled={loading}>
              {loading ? "Verifying…" : "Verify"}
            </Button>
            <button
              className="w-full text-sm text-muted-foreground underline"
              onClick={() => { setSent(false); setOtp(""); }}
              disabled={loading}
            >
              Resend OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}