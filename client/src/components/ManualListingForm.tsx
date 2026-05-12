import { useState, useEffect } from "react";
import { createManualProduct, enrichProductDetails } from "@/api/product";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  X,
  Plus,
  ImageIcon,
  Package,
  Hash,
  CircleX,
  IndianRupee,
  Loader2
} from "lucide-react";

interface ManualListingFormProps {
  onBack: () => void;
  initialData?: any;
}

export default function ManualListingForm({ onBack, initialData }: ManualListingFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    seoTags: [] as string[],
    reachChance: "",
    images: [] as File[]
  });

  const [newTag, setNewTag] = useState("");
  const [isEnriching, setIsEnriching] = useState(false);
  const [aiSuggestedTags, setAiSuggestedTags] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        name: initialData.title || initialData.name || prev.name,
        description: initialData.description || prev.description,
        price: initialData.price ? String(initialData.price) : prev.price,
        category: initialData.category || prev.category,
        seoTags: Array.isArray(initialData.seoTags) ? initialData.seoTags : (Array.isArray(initialData.SEO_Tags) ? initialData.SEO_Tags : prev.seoTags),
        reachChance: initialData.reachChance ? String(initialData.reachChance) : (initialData.Reach_Chance ? String(initialData.Reach_Chance) : prev.reachChance)
      }));
      if (Array.isArray(initialData.seoTags)) setAiSuggestedTags(initialData.seoTags);
      else if (Array.isArray(initialData.SEO_Tags)) setAiSuggestedTags(initialData.SEO_Tags);
    }
  }, [initialData]);

  const handleEnrich = async () => {
    try {
      setIsEnriching(true);
      const textToEnrich = `${formData.name} ${formData.description}`.trim();
      if (!textToEnrich) {
        toast({
          title: "Provide details",
          description: "Please enter a basic title or description first so AI can work its magic.",
          variant: "default"
        });
        return;
      }
      const data = await enrichProductDetails(textToEnrich);

      if (data.success && data.aiResult) {
        const ai = data.aiResult;

        const title = ai.title || ai.Title || ai.name || ai.Name;
        const description = ai.description || ai.Description;
        const price = ai.Price || ai.price;
        const category = ai.Category || ai.category;
        const seoTags = ai.seoTags || ai.SEO_Tags || ai.seo_tags || ai.tags;
        const reachChance = ai.reachChance || ai.Reach_Chance || ai.reach_chance;

        setFormData(prev => ({
          ...prev,
          name: title || prev.name,
          description: description || prev.description,
          price: price ? String(price) : prev.price,
          category: category || prev.category,
          seoTags: Array.isArray(seoTags) && seoTags.length > 0 ? Array.from(new Set([...prev.seoTags, ...seoTags])) : prev.seoTags,
          reachChance: reachChance ? String(reachChance) : prev.reachChance
        }));
        if (Array.isArray(seoTags)) setAiSuggestedTags(seoTags);

        toast({ title: "Magic applied ✨", description: "Your listing has been enriched with AI" });
      } else {
        throw new Error(data.message || "Failed to enrich listing");
      }
    } catch (err: any) {
      toast({
        title: "Enrichment failed",
        description: err?.response?.data?.message || err.message || "Could not connect to AI service",
        variant: "destructive",
      });
    } finally {
      setIsEnriching(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        return toast({
          title: "Missing fields",
          description: "Please fill all required fields",
          variant: "destructive",
        });
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("quantity", formData.quantity || "1");
      data.append("seoTags", JSON.stringify(formData.seoTags));

      if (formData.reachChance) {
        data.append("reachChance", formData.reachChance);
      }

      formData.images.forEach((file) => {
        data.append("images", file);
      });
      await createManualProduct(data);
      toast({
        title: "Product Created 🎉",
        description: "Your listing is live!",
      });
      onBack();
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.seoTags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, seoTags: [...prev.seoTags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, seoTags: prev.seoTags.filter(t => t !== tagToRemove) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5) // Max 5 images
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const AIAssistButton = ({ onClick }: { onClick: () => void }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10"
      onClick={onClick}
      disabled={isEnriching}
    >
      {isEnriching ? <Loader2 className="h-4 w-4 text-primary animate-spin" /> : <Sparkles className="h-4 w-4 text-primary" />}
    </Button>
  );

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Options
        </Button>
        <h2 className="text-2xl font-bold">Create Your Listing</h2>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <div className="relative">
                <Input
                  id="title"
                  placeholder="Enter a catchy product title..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="pr-12"
                />
                <AIAssistButton onClick={handleEnrich} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Describe your product in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[120px] pr-12"
                />
                <AIAssistButton onClick={handleEnrich} />
              </div>
            </div>

            {/* Price and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="pl-10 pr-12"
                  />
                  <AIAssistButton onClick={handleEnrich} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Available Quantity</Label>
                <Input
                  id="quantity"
                  placeholder="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select Category</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Pottery">Pottery</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Woodwork">Woodwork</option>
                  <option value="Metalwork">Metalwork</option>
                  <option value="Glass">Glass</option>
                  <option value="Leather">Leather</option>
                  <option value="Paper Crafts">Paper Crafts</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Art">Art</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Toys">Toys</option>
                  <option value="Other">Other</option>
                </select>
                <AIAssistButton onClick={handleEnrich} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Product Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload up to 5 images of your product
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                  Choose Images
                </Button>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <CircleX />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              SEO Tags & Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Pro Tip:</span> Adding descriptive tags helps your product appear in more search results. AI-generated tags are optimized for maximum visibility.
                </p>
                {formData.reachChance && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500" 
                        style={{ width: `${formData.reachChance}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-green-600 whitespace-nowrap">
                      {formData.reachChance}% Reach Potential
                    </span>
                  </div>
                )}
                {aiSuggestedTags.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-primary/70 uppercase tracking-wider">AI Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {aiSuggestedTags.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!formData.seoTags.includes(tag)) {
                              setFormData(prev => ({ ...prev, seoTags: [...prev.seoTags, tag] }));
                            }
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                            formData.seoTags.includes(tag) 
                              ? "bg-primary/20 border-primary/30 text-primary cursor-default" 
                              : "bg-background border-border hover:border-primary/50 text-muted-foreground"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Add tags (e.g., handmade, vintage, eco-friendly...)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="pr-12"
                  />
                  <AIAssistButton onClick={handleEnrich} />
                </div>
                <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.seoTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.seoTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1">
            Save as Draft
          </Button>
          <Button
            className="flex-1"
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Listing"}
          </Button>
        </div>
      </div>
    </div>
  );
}