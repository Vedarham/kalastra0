import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero p-6 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0" />

      <div className="relative z-10 max-w-md w-full text-center bg-background/95 backdrop-blur border border-border/80 shadow-featured rounded-2xl p-8 space-y-6 md:p-10">
        {/* Broken Compass / Pottery Icon */}
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 animate-pulse">
          <Compass className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-foreground tracking-tighter">404</h1>
          <h2 className="text-xl font-bold text-foreground">Pottery Slipped Off the Wheel!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Just like a fragile vase that slipped from the potter's hands, this page seems to have fallen and broken. It doesn't exist on Kalastra.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Button asChild className="w-full gap-2 font-semibold" size="lg">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full gap-2 font-semibold border-primary/30 hover:bg-primary/5 text-primary" size="lg">
            <Link to="/seller/dashboard">
              View Seller Dashboard (Demo)
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
