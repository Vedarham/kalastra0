import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTopCreators } from "@/api/artisan";
import { useEffect, useState } from "react";

export default function TopCreators() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        const data = await getTopCreators();
        setArtisans(data.artisans);
      } catch (err) {
        console.error("Error fetching artisans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);
  const navigate = useNavigate();
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Top Artisans
            </h2>
            <p className="text-muted-foreground">
              Meet the talented artisans behind exceptional handmade pieces
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            View All Artisans
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {loading && (
          <p className="text-muted-foreground">Loading artisans...</p>
        )}
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide hover:cursor-grab active:cursor-grabbing">
          {artisans.map((artisan) => (
            <Card 
              key={artisan._id} 
              className="min-w-[280px] h-[140px] bg-slate-50 hover:bg-slate-100 border-slate-200 hover:shadow-md transition-all duration-300 cursor-pointer group flex-shrink-0"
            >
              <CardContent className="p-4 h-full flex items-center gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-16 h-16 border-2 border-slate-200">
                    <AvatarImage src={artisan.avatar || ""} alt={artisan.name || "artisan"} />
                    <AvatarFallback className="bg-slate-200 text-slate-600">
                      {artisan.name
                        ? artisan.name.split(" ").map(n => n[0]).join("")
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                  {artisan.isSellerVerified && (
                    <Badge className="absolute -top-1 -right-1 h-5 px-1 text-xs bg-primary text-primary-foreground">
                      ✓
                    </Badge>
                  )}
                </div>
                
                {/* artisan Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">
                    {artisan.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2 truncate">
                    {artisan.shopDescription || "Artisan"}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{Array.isArray(artisan.followers)
                          ? artisan.followers.length
                          : artisan.followers || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{artisan.rating || 4.5}</span>
                    </div>
                    <div className="text-xs">
                      <span>{artisan.totalSales || 0} sales</span>
                    </div>
                  </div>
                  
                  {/* Action */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 h-7 px-3 text-xs bg-white border-slate-300 hover:bg-slate-50"
                    onClick={() => navigate(`/artisans/${artisan._id}`)}
                  >
                    View Collection
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}