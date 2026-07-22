import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import heroImage from "@/assets/hero-marketplace.jpg";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SellOptionsDialog from "./SellOptionsDialog";
import GaneshaHandloom from "@/assets/Shri-Ganesha-Handloom.mp4";
import { useNavigate } from "react-router-dom";
import { useSearch } from "./SearchContext";

export default function HeroSection() {
  const { searchQuery, setSearchQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const navigate = useNavigate();

  const searchPhrases = [
    "Handmade Warli Art...",
    "Handcrafted Bihar Art Pottery...",
    "Naga Wood Art...",
    "pure brass oil lamps...",
    "handcrafted silver jewelry...",
    "Gond Tribe Art Paintings...",
  ];

  // Placeholder typing animation
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let timer: ReturnType<typeof setTimeout>;

    const handleType = () => {
      const currentPhrase = searchPhrases[phraseIndex];
      if (isDeleting) {
        setPlaceholder(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
        typingSpeed = 50;
      } else {
        setPlaceholder(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end of phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % searchPhrases.length;
        typingSpeed = 500; // Pause before next phrase
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    handleType();
    return () => clearTimeout(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery.trim());
      navigate(`/marketplace?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

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
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Discover Unique
            <br />
            <span className="text-accent">Handcrafted Treasures</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-6 opacity-90 leading-relaxed max-w-2xl mx-auto">
            Connect with talented artisans. Buy authentic handmade creations directly from their workshops.
          </p>

          {/* Glassmorphic Search Bar */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-lg mx-auto mb-8 relative z-20">
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1.5 shadow-xl transition-all focus-within:bg-white/15 focus-within:border-white/40">
              <Search className="h-5 w-5 text-white/70 ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder={`Search for ${placeholder}`}
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-full bg-transparent border-0 text-white placeholder-white/50 text-base md:text-lg px-3 py-2 pr-10 focus:ring-0 focus:outline-none"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => setLocalQuery("")}
                  className="text-white/70 hover:text-white mr-2 flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <Button type="submit" size="sm" variant="secondary" className="rounded-full px-6 py-2 font-semibold">
                Search
              </Button>
            </div>
          </form>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button 
              size="lg" 
              variant="secondary" 
              className="w-full sm:w-auto font-semibold"
              onClick={() => navigate("/marketplace")}
            >
              <Search className="h-5 w-5 mr-2" />
              Browse Items
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-slate-900 transition-colors font-semibold"
                >
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