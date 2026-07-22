import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: "all", name: "All Items", icon: "🎨" },
  { id: "pottery", name: "Pottery", icon: "🏺" },
  { id: "textiles", name: "Textiles", icon: "🧶" },
  { id: "jewelry", name: "Jewelry", icon: "💍" },
  { id: "woodwork", name: "Woodwork", icon: "🪵" },
  { id: "painting", name: "Paintings", icon: "🎭" },
  { id: "home", name: "Home Decor", icon: "🏠" },
  { id: "accessories", name: "Accessories", icon: "👜" },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="py-4 border-b border-border bg-slate-50/40">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full">
          <div className="flex space-x-3 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "marketplace" : "outline"}
                className="flex items-center space-x-2 whitespace-nowrap rounded-full px-5 py-2 transition-all duration-200 hover:scale-105 hover:shadow-sm"
                onClick={() => onCategoryChange(category.id)}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}