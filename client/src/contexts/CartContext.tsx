import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, updateCartQuantity as apiUpdateCartQuantity, clearCartApi } from "@/api/cart";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  artisan: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      if (res.data.cart && res.data.cart.items) {
        const formattedItems = res.data.cart.items.map((item: any) => ({
          id: item.product._id,
          title: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0]?.url || "",
          artisan: item.product.artisan,
          quantity: item.quantity
        }));
        setItems(formattedItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    if (user) {
      try {
        await apiAddToCart(product.id, 1);
      } catch (error) {
        console.error("API error adding to cart", error);
      }
    }

    const isExisting = items.find(item => item.id === product.id);
    if (isExisting) {
      toast({
        title: "Updated cart",
        description: "Item quantity increased",
      });
      setItems(prev => prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      toast({
        title: "Added to cart",
        description: `${product.title} added to your cart`,
      });
      setItems(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = async (id: string) => {
    if (user) {
      try {
        await apiRemoveFromCart(id);
      } catch (error) {
        console.error("API error removing from cart", error);
      }
    }

    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart",
    });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    if (user) {
      try {
        await apiUpdateCartQuantity(id, quantity);
      } catch (error) {
        console.error("API error updating cart quantity", error);
      }
    }

    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = async () => {
    if (user) {
      try {
        await clearCartApi();
      } catch (error) {
        console.error("API error clearing cart", error);
      }
    }
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalItems,
      getTotalPrice,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}