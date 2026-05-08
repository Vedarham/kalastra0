import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendOtp, verifyOtp } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function SellerVerify() {
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await sendOtp();
      setSent(true);
      toast({ title: "OTP sent to your email" });
    } catch {
      toast({ title: "Failed to send OTP", variant: "destructive" });
    }
  };

  const handleVerify = async () => {
    try {
      await verifyOtp(otp);
      toast({ title: "Verification successful 🎉" });
      navigate("/seller/dashboard");
    } catch {
      toast({ title: "Invalid OTP", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Verify Your Artisan Account
        </h2>

        {!sent ? (
          <Button className="w-full" onClick={handleSendOtp}>
            Send OTP
          </Button>
        ) : (
          <>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button className="w-full" onClick={handleVerify}>
              Verify
            </Button>
          </>
        )}
      </div>
    </div>
  );
}