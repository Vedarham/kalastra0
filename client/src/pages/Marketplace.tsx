import { useEffect, useState, useCallback, useRef } from "react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import CreatorCampaigns from "@/components/CreatorCampaigns";
import TopCreators from "@/components/TopCreators";
import ProductCard from "@/components/ProductCard";
import ProductDetailDrawer from "@/components/ProductDetailDrawer";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product.types";
import { useLocation } from "react-router-dom";
import { getAllProducts, getProductsByCategory } from "@/api/product";
import { getWishlist, toggleWishlist } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "@/components/SearchContext";

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { searchQuery } = useSearch();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // URL ?q= param takes precedence; context searchQuery used for live typing
  const urlQuery = searchParams.get("q") || "";
  const activeQuery = searchQuery || urlQuery;

  // Debounce reference
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        const [res, wishlistRes] = await Promise.all([
          selectedCategory === "all"
            ? getAllProducts(query)
            : getProductsByCategory(selectedCategory),
          user ? getWishlist() : Promise.resolve({ wishlist: [] }),
        ]);

        if (user && wishlistRes?.wishlist) {
          const favoriteIds = wishlistRes.wishlist.map(
            (item: any) => item._id || item
          );
          setFavorites(favoriteIds);
        }

        setProducts(res.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, user]
  );

  // Debounce search so backend isn't hit on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(activeQuery);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [activeQuery, selectedCategory, fetchProducts]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFavoriteToggle = async (productId: string) => {
    if (!user) {
      toast({ title: "Please login to add to wishlist", variant: "destructive" });
      return;
    }
    try {
      const res = await toggleWishlist(productId);
      setFavorites(res.wishlist || []);
      toast({
        title: favorites.includes(productId)
          ? "Removed from favorites"
          : "Added to favorites",
      });
    } catch {
      toast({ title: "Error updating favorites", variant: "destructive" });
    }
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

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <HeroSection />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <CreatorCampaigns />
      <TopCreators />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {activeQuery
              ? `Search results for "${activeQuery}"`
              : selectedCategory === "all"
              ? "Featured Items"
              : `${
                  selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)
                } Collection`}
          </h2>
          <p className="text-muted-foreground">
            {activeQuery
              ? `${products.length} item${products.length !== 1 ? "s" : ""} found`
              : "Discover unique handcrafted items from talented artisans"}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 bg-muted animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isFavorited={favorites.includes(String(product._id))}
                onFavoriteToggle={handleFavoriteToggle}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {activeQuery
                ? `No results found for "${activeQuery}". Try a different search.`
                : "No items found in this category. Check back soon!"}
            </p>
          </div>
        )}
      </main>

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

      {/* Product Detail Drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
