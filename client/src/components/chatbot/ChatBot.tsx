import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import ChatButton from "./ChatButton";
import ChatBox from "./ChatBox";
import ProductModal from "./ProductModal";
import { Product } from "@/types/product.types";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      title: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "/placeholder.png",
      artisan: product.artisan?.name || "Unknown",
    });
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <>
      <ChatButton onClick={handleOpenChat} isOpen={isOpen} />
      <ChatBox isOpen={isOpen} onClose={handleCloseChat} />
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}