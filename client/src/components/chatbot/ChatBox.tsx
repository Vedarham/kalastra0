import { useState } from "react";
import { X, Send, Mic, Camera, Filter, BotMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearch } from "@/components/SearchContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "./ChatMessage";
import ProductCard from "./ProductCard";
import FiltersPanel from "./FiltersPanel";
// import VoiceInput from "./VoiceInput";
import { Product } from "@/types/product.types";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  products?: Product[];
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_ACTIONS = [
  "Pot under 500 INR",
  "Handmade Wooden Art", 
  "Red, Blue, Tribal Decor",
  "Upload Image to Find Similar"
];


export default function ChatBox({ isOpen, onClose }: ChatBoxProps) {
  const { products, setSearchQuery, setSearchResults } = useSearch();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! How can I assist you today? 🎨",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user", 
      content: inputValue,
      timestamp: new Date()
    };

    // Smart search logic
    const query = inputValue.toLowerCase();
    let filteredProducts = products;

    // Filter by price
    const priceMatch = query.match(/under (\d+)|below (\d+)|less than (\d+)/);
    if (priceMatch) {
      const maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]);
      filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
    }

    // Filter by material/category
    if (query.includes('wooden') || query.includes('wood')) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === 'woodwork');
    } else if (query.includes('ceramic') || query.includes('pottery') || query.includes('pot')) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === 'pottery');
    } else if (query.includes('jewelry') || query.includes('ring') || query.includes('earring')) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === 'jewelry');
    } else if (query.includes('textile') || query.includes('macrame') || query.includes('fabric')) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === 'textiles');
    } else if (query.includes('basket') || query.includes('home')) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === 'home');
    }

    // Filter by color
    const colors = ['red', 'blue', 'green', 'yellow', 'turquoise', 'silver'];
    const mentionedColor = colors.find(color => query.includes(color));
    if (mentionedColor === 'turquoise' || mentionedColor === 'silver') {
      filteredProducts = filteredProducts.filter(p => p.category === 'jewelry');
    }

    // Filter by general search terms
    if (!priceMatch) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.artisan?.name?.toLowerCase().includes(query)
    );
  }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: filteredProducts.length > 0 
        ? `Found ${filteredProducts.length} product${filteredProducts.length > 1 ? 's' : ''} matching "${inputValue}":` 
        : `Sorry, I couldn't find any products matching "${inputValue}". Try searching for pottery, woodwork, jewelry, textiles, or home items.`,
      timestamp: new Date(),
      products: filteredProducts.length > 0 ? filteredProducts : undefined
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputValue("");
    
    // Update main search context
    setSearchQuery(inputValue);
    setSearchResults(filteredProducts.map(p => ({ ...p, type: 'product' })));
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const imageMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: "🖼️ Uploaded image - searching for similar products...",
        timestamp: new Date()
      };

      // Simulate image analysis delay
      setMessages(prev => [...prev, imageMessage]);
      
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot", 
          content: "Based on your image, I found these similar handcrafted items:",
          timestamp: new Date(),
          products: products.slice(0, 3) // Top 3 similar items
        };
        setMessages(prev => [...prev, botResponse]);
        
        toast({
          title: "Image analyzed!",
          description: "Found similar products based on your upload.",
        });
      }, 1500);
    }
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

  interface Filters {
    priceRange: [number, number];
    materials: string[];
    occasions: string[];
  }

  const handleApplyFilters = (filters: Filters) => {
    const { priceRange, materials, occasions } = filters;
    
    let filtered = products.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (materials.length > 0) {
      filtered = filtered.filter(product => {
        const productMaterial = product.category.toLowerCase();
        return materials.some((material: string) => 
          productMaterial.includes(material.toLowerCase()) ||
          (material.toLowerCase() === 'wood' && productMaterial === 'woodwork') ||
          (material.toLowerCase() === 'clay' && productMaterial === 'pottery') ||
          (material.toLowerCase() === 'ceramic' && productMaterial === 'pottery') ||
          (material.toLowerCase() === 'textile' && productMaterial === 'textiles')
        );
      });
    }

    const botResponse: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: `Applied filters - showing ${filtered.length} products:`,
      timestamp: new Date(),
      products: filtered
    };

    setMessages(prev => [...prev, botResponse]);
    
    toast({
      title: "Filters applied!",
      description: `Found ${filtered.length} products matching your criteria.`,
    });
  };

  // const handleVoiceTranscript = (transcript: string) => {
  //   setInputValue(transcript);
  //   setTimeout(() => handleSendMessage(), 500);
  // };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! Looking for something special?";
    if (hour < 17) return "Good afternoon! How can I help you find amazing handcrafted items?";
    return "Good evening! Let me help you discover beautiful artisan products!";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in shadow-soft">
      <Card className="w-96 h-[600px] overflow-y-scroll shadow-featured border-primary/20 bg-card">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-hero text-primary-foreground">
          <div>
            <div className="flex items-center gap-2 mb-1">
            <BotMessageSquare />
            <h3 className="font-semibold">KalaBot</h3>
            </div>
            <p className="text-sm opacity-90">{getGreeting()}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 h-[400px]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessage message={message} />
                {message.products && (
                  <div className="mt-3 space-y-2">
                    {message.products.map((product) => (
                      <ProductCard 
                        key={product._id} 
                        product={product}
                        onAddToCart={(id) => {
                          const p = products.find(n => n._id === id);
                          if (p) handleAddToCart(p);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="p-2 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className="text-xs"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <FiltersPanel 
            onClose={() => setShowFilters(false)} 
            onApplyFilters={handleApplyFilters}
          />
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your request here..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                {/* <VoiceInput onTranscript={handleVoiceTranscript} /> */}
                <label>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {messages.some(m => m.products) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}