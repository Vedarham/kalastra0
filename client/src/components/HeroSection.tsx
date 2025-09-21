import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-marketplace.jpg";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SellOptionsDialog from "./SellOptionsDialog";
import GaneshaHandloom from "@/assets/Shri-Ganesha-Handloom.mp4";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[70vh] flex items-center">
      {/* Video Background */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src={GaneshaHandloom} type="video/mp4" />
        {/* Fallback image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      </video>
      <div className="absolute inset-0 bg-gradient-overlay" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Unique
            <br />
            <span className="text-accent">Handcrafted Treasures</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Connect with talented artisans worldwide. Buy authentic handmade items 
            or sell your own beautiful creations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              <Search className="h-5 w-5 mr-2" />
              Browse Items
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-color-primary-foreground border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Start Selling
                </Button>
              </DialogTrigger>
              <SellOptionsDialog />
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
}