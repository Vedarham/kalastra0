import { useEffect, useState } from "react";
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
import { Product } from "@/types/product.types";
import { getAllProducts, getProductsByCategory } from "@/api/product";

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res =
          selectedCategory === "all"
            ? await getAllProducts()
            : await getProductsByCategory(selectedCategory);

        setProducts(res.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);
  

  const handleFavoriteToggle = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      addToCart({
        id: String(product._id),
        title: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "/placeholder.png",
        artisan: product.artisan?.name || "Unknown",
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
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
              <ProductCard 
              key = {product._id} 
              product={product} 
              onFavoriteToggle={handleFavoriteToggle}
              onAddToCart={handleAddToCart}/>
            ))}
        </div>
        )}
        {!loading && products.length === 0 && (
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
