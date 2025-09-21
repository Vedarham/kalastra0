import { useState } from "react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import CreatorCampaigns from "@/components/CreatorCampaigns";
import TopCreators from "@/components/TopCreators";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

import ceramicBowlImage from "@/assets/product-ceramic-bowl.jpg";
import macrameImage from "@/assets/product-macrame.jpg";
import woodenBoardImage from "@/assets/product-wooden-board.jpg";
import jewelryImage from "@/assets/product-jewelry.jpg";
import basketImage from "@/assets/product-basket.jpg";

const mockProducts = [
  {
    id: "1",
    title: "Handcrafted Ceramic Bowl",
    price: 45,
    originalPrice: 60,
    image: ceramicBowlImage,
    artisan: "Elena Rodriguez",
    rating: 4.9,
    reviewCount: 127,
    category: "pottery",
  },
  {
    id: "2",
    title: "Macrame Wall Hanging",
    price: 85,
    image: macrameImage,
    artisan: "Sarah Kim",
    rating: 4.8,
    reviewCount: 89,
    category: "textiles",
  },
  {
    id: "3",
    title: "Artisan Wooden Cutting Board",
    price: 75,
    originalPrice: 95,
    image: woodenBoardImage,
    artisan: "Marcus Thompson",
    rating: 4.9,
    reviewCount: 156,
    category: "woodwork",
  },
  {
    id: "4",
    title: "Turquoise Silver Earrings",
    price: 120,
    image: jewelryImage,
    artisan: "Ana Martinez",
    rating: 5.0,
    reviewCount: 78,
    category: "jewelry",
  },
  {
    id: "5",
    title: "Natural Fiber Basket",
    price: 65,
    image: basketImage,
    artisan: "David Chen",
    rating: 4.7,
    reviewCount: 93,
    category: "home",
  },
  {
    id: "6",
    title: "Hand-thrown Terra Cotta Vase",
    price: 95,
    originalPrice: 120,
    image: ceramicBowlImage,
    artisan: "Maria Santos",
    rating: 4.8,
    reviewCount: 104,
    category: "pottery",
  },
  {
    id: "7",
    title: "Bohemian Macrame Plant Hanger",
    price: 55,
    image: macrameImage,
    artisan: "Lily Nguyen",
    rating: 4.9,
    reviewCount: 67,
    category: "textiles",
  },
  {
    id: "8",
    title: "Reclaimed Wood Serving Tray",
    price: 80,
    originalPrice: 100,
    image: woodenBoardImage,
    artisan: "James Wilson",
    rating: 4.8,
    reviewCount: 112,
    category: "woodwork",
  },
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { addToCart } = useCart();

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "all"
      ? mockProducts
      : mockProducts.filter((product) => product.category === selectedCategory);

  const handleFavoriteToggle = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      addToCart({
        id: String(product.id),
        title: product.title,
        price: product.price,
        image: product.image,
        artisan: product.artisan,
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <HeroSection />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Creator Campaigns */}
      <CreatorCampaigns />

      {/* Top Creators */}
      <TopCreators />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {selectedCategory === "all"
              ? "Featured Items"
              : `${
                  selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)
                } Collection`}
          </h2>
          <p className="text-muted-foreground">
            Discover unique handcrafted items from talented artisans
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              id={String(product.id)}
              reviewCount={product.rating}
              isFavorited={favorites.includes(String(product.id))}
              onFavoriteToggle={handleFavoriteToggle}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No items found in this category. Check back soon for new arrivals!
            </p>
          </div>
        )}
      </main>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 rounded-full shadow-featured"
          size="icon"
          variant="marketplace"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}

      <Footer />
    </div>
  );
}
