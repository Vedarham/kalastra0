import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Users, ArrowLeft, Heart, Share2, MessageCircle, MapPin, Calendar } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import creatorElena from "@/assets/creator-elena.jpg";
import creatorSarah from "@/assets/creator-sarah.jpg";
import creatorMarcus from "@/assets/creator-marcus.jpg";
import creatorAna from "@/assets/creator-ana.jpg";
import productCeramicBowl from "@/assets/product-ceramic-bowl.jpg";
import productWoodenBoard from "@/assets/product-wooden-board.jpg";
import productMacrame from "@/assets/product-macrame.jpg";
import productJewelry from "@/assets/product-jewelry.jpg";

// Mock creators data with extended info
const creatorsData = {
  "1": {
    id: "1",
    name: "Ananya Sharma",
    specialty: "Ceramic Artist",
    avatar: creatorElena,
    followers: "12.4K",
    rating: 4.9,
    totalSales: 1247,
    isVerified: true,
    location: "Jaipur, Rajasthan",
    joinDate: "March 2020",
    bio: "Passionate ceramic artist creating functional and decorative pottery inspired by traditional Indian art and modern minimalism.",
    story: "Ananya's journey began in her grandmother's pottery studio in a small village in Rajasthan. She combines traditional techniques with contemporary designs to create unique pieces that tell stories of heritage and innovation.",
    collections: [
      {
        id: "1",
        title: "Handmade Terracotta Vase",
        price: 45,
        originalPrice: 55,
        image: productCeramicBowl,
        artisan: "Ananya Sharma",
        rating: 4.9,
        reviewCount: 127,
        category: "pottery"
      },
      {
        id: "2", 
        title: "Blue Pottery Coasters",
        price: 65,
        originalPrice: 75,
        image: productCeramicBowl,
        artisan: "Ananya Sharma",
        rating: 4.8,
        reviewCount: 89,
        category: "pottery"
      }
    ]
  },
  "2": {
    id: "2",
    name: "Priya Patel",
    specialty: "Textile Designer", 
    avatar: creatorSarah,
    followers: "8.9K",
    rating: 4.8,
    totalSales: 892,
    isVerified: true,
    location: "Ahmedabad, Gujarat",
    joinDate: "July 2019",
    bio: "Textile designer specializing in sustainable fabrics and contemporary patterns inspired by nature and urban landscapes.",
    story: "Priya's work reflects her commitment to sustainable fashion and her Gujarati heritage, blending traditional textile techniques like Bandhani and Ajrakh with modern design sensibilities.",
    collections: [
      {
        id: "3",
        title: "Bandhani Dupatta",
        price: 28,
        originalPrice: 35,
        image: productMacrame,
        artisan: "Priya Patel",
        rating: 4.7,
        reviewCount: 64,
        category: "textiles"
      }
    ]
  },
  "3": {
    id: "3",
    name: "Rohan Mehta",
    specialty: "Woodworker",
    avatar: creatorMarcus,
    followers: "15.2K", 
    rating: 4.9,
    totalSales: 1569,
    isVerified: true,
    location: "Srinagar, Kashmir",
    joinDate: "January 2018",
    bio: "Master woodworker crafting heirloom-quality furniture and decorative pieces from sustainably sourced hardwoods.",
    story: "Rohan learned woodworking from his grandfather in Kashmir and has spent over two decades perfecting his craft. Each piece is a testament to traditional techniques and modern functionality.",
    collections: [
      {
        id: "4",
        title: "Walnut Wood Spice Box",
        price: 32,
        originalPrice: 40,
        image: productWoodenBoard,
        artisan: "Rohan Mehta",
        rating: 4.9,
        reviewCount: 156,
        category: "woodwork"
      }
    ]
  },
  "4": {
    id: "4",
    name: "Isha Singh",
    specialty: "Jewelry Designer",
    avatar: creatorAna,
    followers: "6.7K",
    rating: 5.0,
    totalSales: 634,
    isVerified: true,
    location: "Jaipur, Rajasthan",
    joinDate: "September 2021",
    bio: "Contemporary jewelry designer creating one-of-a-kind pieces that celebrate individuality and craftsmanship.",
    story: "Isha's jewelry tells stories of personal journey and cultural heritage, using ethically sourced materials to create pieces that are both beautiful and meaningful.",
    collections: [
      {
        id: "5",
        title: "Handcrafted Silver Ring",
        price: 75,
        originalPrice: 90,
        image: productJewelry,
        artisan: "Isha Singh",
        rating: 5.0,
        reviewCount: 43,
        category: "jewelry"
      }
    ]
  }
};

export default function CreatorProfile() {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const creator = creatorId ? creatorsData[creatorId as keyof typeof creatorsData] : null;

  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Creator not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (productId: string) => {
    const product = creator.collections.find(p => p.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      {/* Hero Section */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-4 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback className="text-2xl">
                  {creator.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {creator.isVerified && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                  ✓ Verified
                </Badge>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{creator.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{creator.specialty}</p>
              
              <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{creator.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {creator.joinDate}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{creator.followers}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{creator.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{creator.totalSales}</span>
                  <span className="text-muted-foreground">sales</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant={isFollowing ? "outline" : "marketplace"}
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="gap-2"
                >
                  <Heart className={`h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="collections" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collections" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Collections</h2>
              <p className="text-muted-foreground">
                Discover unique handmade pieces by {creator.name}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {creator.collections.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  artisan={product.artisan}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  isFavorited={favorites.includes(product.id)}
                  onFavoriteToggle={() => handleFavoriteToggle(product.id)}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="mt-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold mb-4">About {creator.name}</h2>
              <p className="text-lg text-muted-foreground mb-6">{creator.bio}</p>
              
              <h3 className="text-xl font-semibold mb-3">Story</h3>
              <p className="text-muted-foreground leading-relaxed">{creator.story}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{creator.rating}</span>
                </div>
                <span className="text-muted-foreground">Based on {creator.totalSales} sales</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((review) => (
                <Card key={review}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>U{review}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Customer {review}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          Amazing quality and craftsmanship! The attention to detail is incredible.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}