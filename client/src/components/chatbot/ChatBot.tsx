import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import ChatButton from "./ChatButton";
import ChatBox from "./ChatBox";
import ProductModal from "./ProductModal";

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  creator: string;
  rating: number;
  category: string;
}

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
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      artisan: product.creator
    });
    
    toast({
      title: "Added to cart!",
      description: `${product.title} has been added to your cart.`,
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