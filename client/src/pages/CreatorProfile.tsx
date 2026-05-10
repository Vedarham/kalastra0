import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ArrowLeft, Heart, Share2, MessageCircle, MapPin, Calendar, Users } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { followArtisan, getArtisan, unfollowArtisan } from "@/api/artisan";
import { useAuth } from "@/contexts/AuthContext";

export default function CreatorProfile() {
  const { artisanId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const res = await getArtisan(artisanId!);
        setArtisan(res.data.artisan);
        setProducts(res.data.products);
      } catch {
        setArtisan(null);
        setProducts(null);
      } finally {
        setLoading(false);
      }
    };

    if (artisanId) fetchArtisan();
  }, [artisanId]);

    if (loading) {
    return <div className="p-10 text-center">Loading artisan...</div>;
    }

  if (!artisan) {
    console.log(products)
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">artisan not found</h1>
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
    const product = artisan.products?.find((p) => p._id === productId);
    if (product) addToCart(product);

  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowArtisan(artisanId!);
        setArtisan((prev: any) => ({
          ...prev,
          followers: Array.isArray(prev.followers) 
            ? prev.followers.filter((id: any) => id !== user?._id) 
            : Math.max(0, prev.followers - 1),
        }));
      } else {
        await followArtisan(artisanId!);
        setArtisan((prev: any) => ({
          ...prev,
          followers: Array.isArray(prev.followers) 
            ? [...prev.followers, user?._id] 
            : prev.followers + 1,
        }));
      }

      setIsFollowing(!isFollowing);
    } catch {
      console.error("Follow failed");
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
                <AvatarImage src={artisan.avatar} alt={artisan.name} />
                <AvatarFallback className="text-2xl">
                  {artisan.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {artisan.isSellerVerified && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                  ✓ Verified
                </Badge>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{artisan.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{artisan.category}</p>
              
              <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{artisan.location?.city}, {artisan.location?.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(artisan.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">
                    {Array.isArray(artisan.followers) ? artisan.followers.length : (artisan.followers || 0)}
                  </span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{artisan.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{artisan.totalSales}</span>
                  <span className="text-muted-foreground">sales</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant={isFollowing ? "outline" : "marketplace"}
                  onClick={handleFollow}
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
                Discover unique handmade pieces by {artisan.name}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product: any) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isFavorited={favorites.includes(product._id)}
                  onFavoriteToggle={() => handleFavoriteToggle(product._id)}
                  onAddToCart={() => handleAddToCart(product._id)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="mt-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold mb-4">About {artisan.name}</h2>
              <p className="text-lg text-muted-foreground mb-6">{artisan.shopDescription}</p>
              
              <h3 className="text-xl font-semibold mb-3">Story</h3>
              <p className="text-muted-foreground leading-relaxed">{artisan.bio}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{artisan.rating}</span>
                </div>
                <span className="text-muted-foreground">Based on {artisan.totalSales} sales</span>
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