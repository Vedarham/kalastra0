import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink } from "lucide-react";
import creatorElena from "@/assets/creator-elena.jpg";
import creatorSarah from "@/assets/creator-sarah.jpg";
import creatorMarcus from "@/assets/creator-marcus.jpg";
import creatorAna from "@/assets/creator-ana.jpg";

// Mock campaign data with real images
const campaignAds = [
  {
    id: "1",
    title: "Sustainable Pottery Collection",
    creator: "Ananya Sharma",
    image: creatorElena,
    type: "Video Campaign",
    description: "Discover eco-friendly ceramic pieces handcrafted with love",
    cta: "Watch Story"
  },
  {
    id: "2", 
    title: "Bohemian Textile Art",
    creator: "Priya Patel",
    image: creatorSarah,
    type: "Photo Series",
    description: "Explore vibrant macrame and woven art pieces",
    cta: "View Gallery"
  },
  {
    id: "3",
    title: "Artisan Woodworking Journey",
    creator: "Rohan Mehta", 
    image: creatorMarcus,
    type: "Documentary",
    description: "From tree to table - the art of handcrafted furniture",
    cta: "Watch Film"
  },
  {
    id: "4",
    title: "Jewelry Making Masterclass",
    creator: "Isha Singh",
    image: creatorAna, 
    type: "Live Workshop",
    description: "Learn the secrets of silver smithing and stone setting",
    cta: "Join Live"
  }
];

export default function CreatorCampaigns() {
  return (
    <section className="py-12 bg-muted/30 ">
      <div className="container mx-auto px-4 hover:cursor-grab active:cursor-grabbing">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Creator Campaigns
          </h2>
          <p className="text-muted-foreground">
            Discover the stories behind your favorite handmade pieces
          </p>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {campaignAds.map((campaign) => (
            <Card 
              key={campaign.id} 
              className="min-w-[350px] hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button size="lg" className="gap-2">
                    <Play className="h-5 w-5" />
                    {campaign.cta}
                  </Button>
                </div>
                <Badge 
                  variant="secondary" 
                  className="absolute top-3 left-3 bg-white/90 text-foreground"
                >
                  {campaign.type}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {campaign.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  by {campaign.creator}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {campaign.description}
                </p>
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {campaign.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}