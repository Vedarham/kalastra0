import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Users, ArrowRight } from "lucide-react";
import creatorElena from "@/assets/creator-elena.jpg";
import creatorSarah from "@/assets/creator-sarah.jpg";
import creatorMarcus from "@/assets/creator-marcus.jpg";
import creatorAna from "@/assets/creator-ana.jpg";
import { useNavigate } from "react-router-dom";

// Mock top creators data with real images
const topCreators = [
  {
    id: "1",
    name: "Ananya Sharma",
    specialty: "Ceramic Artist",
    avatar: creatorElena,
    followers: "12.4K",
    rating: 4.9,
    totalSales: 1247,
    isVerified: true
  },
  {
    id: "2",
    name: "Priya Patel", 
    specialty: "Textile Designer",
    avatar: creatorSarah,
    followers: "8.9K",
    rating: 4.8,
    totalSales: 892,
    isVerified: true
  },
  {
    id: "3",
    name: "Rohan Mehta",
    specialty: "Woodworker",
    avatar: creatorMarcus, 
    followers: "15.2K",
    rating: 4.9,
    totalSales: 1569,
    isVerified: true
  },
  {
    id: "4",
    name: "Isha Singh",
    specialty: "Jewelry Designer", 
    avatar: creatorAna,
    followers: "6.7K",
    rating: 5.0,
    totalSales: 634,
    isVerified: true
  },
  {
    id: "5",
    name: "Vikram Verma",
    specialty: "Metal Craftsman",
    avatar: creatorElena,
    followers: "4.3K",
    rating: 4.7,
    totalSales: 421,
    isVerified: false
  },
  {
    id: "6",
    name: "Sunita Devi",
    specialty: "Painter",
    avatar: creatorSarah,
    followers: "9.1K",
    rating: 4.8,
    totalSales: 756,
    isVerified: true
  },
  {
    id: "7",
    name: "Rajesh Kumar",
    specialty: "Leather Craftsman",
    avatar: creatorMarcus,
    followers: "5.8K",
    rating: 4.6,
    totalSales: 389,
    isVerified: false
  }
];

export default function TopCreators() {
  const navigate = useNavigate();
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Top Creators
            </h2>
            <p className="text-muted-foreground">
              Meet the talented artisans behind exceptional handmade pieces
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            View All Creators
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide hover:cursor-grab active:cursor-grabbing">
          {topCreators.map((creator) => (
            <Card 
              key={creator.id} 
              className="min-w-[280px] h-[140px] bg-slate-50 hover:bg-slate-100 border-slate-200 hover:shadow-md transition-all duration-300 cursor-pointer group flex-shrink-0"
            >
              <CardContent className="p-4 h-full flex items-center gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-16 h-16 border-2 border-slate-200">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback className="bg-slate-200 text-slate-600">
                      {creator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {creator.isVerified && (
                    <Badge className="absolute -top-1 -right-1 h-5 px-1 text-xs bg-primary text-primary-foreground">
                      ✓
                    </Badge>
                  )}
                </div>
                
                {/* Creator Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">
                    {creator.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2 truncate">
                    {creator.specialty}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{creator.followers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{creator.rating}</span>
                    </div>
                    <div className="text-xs">
                      <span>{creator.totalSales} sales</span>
                    </div>
                  </div>
                  
                  {/* Action */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 h-7 px-3 text-xs bg-white border-slate-300 hover:bg-slate-50"
                    onClick={() => navigate(`/creator/${creator.id}`)}
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