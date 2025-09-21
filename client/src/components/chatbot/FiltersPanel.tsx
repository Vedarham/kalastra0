import { X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface FiltersPanelProps {
  onClose: () => void;
  onApplyFilters?: (filters: any) => void;
}

const MATERIALS = ["Wood", "Clay", "Ceramic", "Metal", "Textile", "Glass"];
const OCCASIONS = ["Diwali", "Birthday", "Wedding", "Housewarming", "Anniversary"];

export default function FiltersPanel({ onClose, onApplyFilters }: FiltersPanelProps) {
  const [priceRange, setPriceRange] = useState([100, 1000]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);

  const handleMaterialChange = (material: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterials(prev => [...prev, material]);
    } else {
      setSelectedMaterials(prev => prev.filter(m => m !== material));
    }
  };

  const handleOccasionChange = (occasion: string, checked: boolean) => {
    if (checked) {
      setSelectedOccasions(prev => [...prev, occasion]);
    } else {
      setSelectedOccasions(prev => prev.filter(o => o !== occasion));
    }
  };

  const resetFilters = () => {
    setPriceRange([100, 1000]);
    setSelectedMaterials([]);
    setSelectedOccasions([]);
  };

  const applyFilters = () => {
    const filters = {
      priceRange,
      materials: selectedMaterials,
      occasions: selectedOccasions
    };
    onApplyFilters?.(filters);
    onClose();
  };

  return (
    <div className="absolute bottom-0 right-0 z-10 mb-2 animate-fade-in">
      <Card className="w-80 shadow-soft border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Filters</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={resetFilters}
                className="h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={2000}
              min={50}
              step={50}
              className="w-full"
            />
          </div>

          {/* Materials */}
          <div>
            <label className="text-sm font-medium mb-2 block">Materials</label>
            <div className="grid grid-cols-2 gap-2">
              {MATERIALS.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={material}
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={(checked) => 
                      handleMaterialChange(material, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={material}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {material}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Occasions */}
          <div>
            <label className="text-sm font-medium mb-2 block">Occasions</label>
            <div className="grid grid-cols-2 gap-2">
              {OCCASIONS.map((occasion) => (
                <div key={occasion} className="flex items-center space-x-2">
                  <Checkbox
                    id={occasion}
                    checked={selectedOccasions.includes(occasion)}
                    onCheckedChange={(checked) => 
                      handleOccasionChange(occasion, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={occasion}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {occasion}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}