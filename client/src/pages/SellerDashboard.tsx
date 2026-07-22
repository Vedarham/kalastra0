import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Package,
  Star,
  Eye,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getSellerOrders, getSellerStats } from "@/api/order";
import { getMyProducts, deleteProduct, updateProduct } from "@/api/product";
import SellOptionsDialog from "@/components/SellOptionsDialog";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product.types";

type RevenuePoint = { month: string; revenue: number; orders: number };

type SellerStats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  revenueChart: RevenuePoint[];
};

type OrderItem = {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  status: string;
};

type RecentOrder = {
  _id: string;
  orderNumber: string;
  buyer: { name: string; email: string };
  items: OrderItem[];
  pricing: { total: number };
  status: string;
  createdAt: string;
};

// ── Static data (charts that don't need real data yet) ────────────────────

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
  orders: { label: "Orders", color: "hsl(var(--accent))" },
};

// Placeholder region data — replace with real aggregation later
const regionData = [
  { region: "Maharashtra", orders: 42 },
  { region: "Delhi", orders: 35 },
  { region: "Karnataka", orders: 28 },
  { region: "Tamil Nadu", orders: 22 },
  { region: "Gujarat", orders: 18 },
  { region: "Others", orders: 31 },
];

const customerTypeData = [
  { type: "New", value: 45, color: "hsl(var(--primary))" },
  { type: "Returning", value: 35, color: "hsl(var(--accent))" },
  { type: "Loyal", value: 20, color: "#10b981" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  processing: "bg-purple-100 text-purple-700 border-purple-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
  refunded: "bg-gray-100 text-gray-600 border-gray-300",
};

const MOCK_STATS: SellerStats = {
  totalRevenue: 124500,
  totalOrders: 48,
  totalProducts: 3,
  revenueChart: [
    { month: "Jan", revenue: 15000, orders: 6 },
    { month: "Feb", revenue: 18000, orders: 7 },
    { month: "Mar", revenue: 22000, orders: 8 },
    { month: "Apr", revenue: 20000, orders: 8 },
    { month: "May", revenue: 24000, orders: 9 },
    { month: "Jun", revenue: 25500, orders: 10 },
  ]
};

const MOCK_PRODUCTS: Product[] = [
  {
    _id: "mock_1",
    name: "Handcrafted Terracotta Clay Pot",
    description: "Traditional Indian terracotta clay pot, hand-turned by master potters and baked in brick kilns. Perfect for water storage or organic home decor.",
    price: 450,
    category: "Pottery",
    stock: 12,
    images: [{ url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=400" }],
    isActive: true,
    rating: 4.8,
    artisan: { name: "Ram Potters" } as any,
    seoTags: ["clay", "terracotta", "pottery", "organic"]
  },
  {
    _id: "mock_2",
    name: "Pure Silk Banarasi Handloom Saree",
    description: "Exquisite handwoven Banarasi saree made from the finest pure silk yarns, featuring intricate gold and silver zari brocade work. Handcrafted in Varanasi.",
    price: 8500,
    category: "Textiles",
    stock: 3,
    images: [{ url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400" }],
    isActive: true,
    rating: 4.9,
    artisan: { name: "Varanasi Weavers" } as any,
    seoTags: ["silk", "saree", "handloom", "banarasi"]
  },
  {
    _id: "mock_3",
    name: "Carved Walnut Wood Table",
    description: "Premium Kashmir walnut wood end table, hand-carved with traditional chinar leaf patterns. Sturdy, elegant, and timeless.",
    price: 12000,
    category: "Woodwork",
    stock: 5,
    images: [{ url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=400" }],
    isActive: true,
    rating: 4.7,
    artisan: { name: "Kashmir Crafts" } as any,
    seoTags: ["walnut", "woodwork", "table", "handcarved"]
  }
];

const MOCK_ORDERS: RecentOrder[] = [
  {
    _id: "order_1",
    orderNumber: "ORD-99218",
    buyer: { name: "Aarav Sharma", email: "aarav@gmail.com" },
    items: [
      { _id: "item_1", name: "Handcrafted Terracotta Clay Pot", image: "", price: 450, quantity: 2, status: "processing" }
    ],
    pricing: { total: 900 },
    status: "processing",
    createdAt: new Date().toISOString()
  },
  {
    _id: "order_2",
    orderNumber: "ORD-99120",
    buyer: { name: "Ananya Iyer", email: "ananya@yahoo.com" },
    items: [
      { _id: "item_2", name: "Pure Silk Banarasi Handloom Saree", image: "", price: 8500, quantity: 1, status: "confirmed" }
    ],
    pricing: { total: 8500 },
    status: "confirmed",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const SellerDashboard = () => {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSellOptionsOpen, setIsSellOptionsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price: 0, category: "", stock: 1 });
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user || user.role !== "seller") {
      setIsGuestMode(true);
    } else {
      setIsGuestMode(false);
    }
  }, [user, isAuthLoading]);

  // Load mock data if in guest mode
  useEffect(() => {
    if (!isGuestMode) return;
    setStats(MOCK_STATS);
    setRecentOrders(MOCK_ORDERS);
    setProducts(MOCK_PRODUCTS);
    setSelectedProduct("mock_1");
    setLoadingStats(false);
    setLoadingOrders(false);
    setLoadingProducts(false);
  }, [isGuestMode]);

  useEffect(() => {
    if (isGuestMode || !user || user.role !== "seller") return;

    const fetchStats = async () => {
      try {
        const res = await getSellerStats();
        setStats(res.data.data);
      } catch (err) {
        console.error("Stats fetch failed:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user, isGuestMode]);

  useEffect(() => {
    if (isGuestMode || !user || user.role !== "seller") return;

    const fetchOrders = async () => {
      try {
        const res = await getSellerOrders();
        setRecentOrders(res.data.orders || []);
      } catch (err) {
        console.error("Orders fetch failed:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user, isGuestMode]);

  useEffect(() => {
    if (isGuestMode || !user || user.role !== "seller") return;

    const fetchProducts = async () => {
      try {
        const res = await getMyProducts();
        setProducts(res.products || []);
        if (res.products && res.products.length > 0) {
          setSelectedProduct(res.products[0]._id);
        }
      } catch (err) {
        console.error("Products fetch failed:", err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [user, isGuestMode]);

  const handleDeleteProduct = async (id: string) => {
    if (isGuestMode) {
      toast({
        title: "Guest Mode 🔒",
        description: "Artisan account required to delete products. Please sign in or switch your role.",
        variant: "destructive"
      });
      return;
    }
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setIsDeleting(id);
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast({ title: "Product deleted successfully" });
    } catch (err) {
      toast({ title: err.response?.data?.message || "Failed to delete product", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuestMode) {
      toast({
        title: "Guest Mode 🔒",
        description: "Artisan account required to update products. Please sign in or switch your role.",
        variant: "destructive"
      });
      return;
    }
    if (!editingProduct) return;
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", String(editForm.price));
      formData.append("category", editForm.category);
      formData.append("stock", String(editForm.stock));
      
      await updateProduct(editingProduct._id, formData);
      setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...editForm } : p));
      toast({ title: "Product updated successfully" });
      setEditingProduct(null);
    } catch (err: any) {
      toast({ title: err.response?.data?.message || "Failed to update product", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    if (isGuestMode) {
      toast({
        title: "Guest Mode 🔒",
        description: "Artisan account required to modify product status. Please sign in or switch your role.",
        variant: "destructive"
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("isActive", String(!product.isActive));
      
      await updateProduct(product._id, formData);
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: !product.isActive } : p));
      toast({ title: `Product ${!product.isActive ? 'activated' : 'discontinued'} successfully` });
    } catch (err: any) {
      toast({ title: err.response?.data?.message || "Failed to update product status", variant: "destructive" });
    }
  };
  
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isGuestMode && (!user || user.role !== "seller")) return null;

  const revenueData: RevenuePoint[] = stats?.revenueChart ?? [];

  // Use real product.sales field; show a simple bar for total sales
  const productComparisonData = products.slice(0, 5).map((p) => ({
    productName:
      p.name.length > 15 ? p.name.substring(0, 15) + "…" : p.name,
    sales: (p as any).sales ?? 0,
  }));

  // For the area chart of the selected product, show its cumulative sales as a flat reference
  const selectedProductObj = products.find((p) => p._id === selectedProduct);
  const filteredProductData = selectedProductObj
    ? [{ month: "Total", sales: (selectedProductObj as any).sales ?? 0 }]
    : [];
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            className="mb-4 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {isGuestMode ? "Guest Voyager" : user?.name}! Here's your business overview.
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                isGuestMode
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : user?.isSellerVerified
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-yellow-100 text-yellow-700 border-yellow-300"
              }
            >
              <Star className="w-3 h-3 mr-1" />
              {isGuestMode ? "Demo Mode" : user?.isSellerVerified ? "Verified Artisan" : "Pending Verification"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Guest Mode Banner or Verification Banner */}
      {isGuestMode ? (
        <div className="container mx-auto px-4 mt-6">
          <Card className="border-primary/30 bg-primary/5 shadow-soft">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-primary mb-1 flex items-center gap-2">
                  <span>👋</span> Guest Demo Mode
                </h2>
                <p className="text-sm text-muted-foreground">
                  You are viewing a live demo of the Kalastra Seller Dashboard. Sign in or register as an artisan to list your own products, track sales, and access real analytics.
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto flex-shrink-0">
                <Button variant="outline" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/auth?tab=signup")}>
                  Become an Artisan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : !user?.isSellerVerified ? (
        <div className="container mx-auto px-4 mt-6">
          <Card className="border-yellow-400 bg-yellow-50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                Verification Required 🚧
              </h2>
              <p className="text-sm text-yellow-700 mb-4">
                Complete verification to start selling and access full analytics.
              </p>
              <Button onClick={() => navigate("/seller/verify")}>
                Complete Verification
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="container mx-auto px-4 py-8">
        {/* ── Key Metrics ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Total Revenue"
            value={`₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
            loading={loadingStats}
            icon={<DollarSign className="w-5 h-5 text-primary" />}
            iconBg="bg-primary/10"
            trend="+12% from last month"
          />
          <MetricCard
            label="Total Orders"
            value={String(stats?.totalOrders ?? 0)}
            loading={loadingStats}
            icon={<Package className="w-5 h-5 text-accent" />}
            iconBg="bg-accent/10"
            trend="+8% from last month"
          />
          <MetricCard
            label="Total Products"
            value={String(stats?.totalProducts ?? 0)}
            loading={loadingStats}
            icon={<Eye className="w-5 h-5 text-blue-600" />}
            iconBg="bg-blue-100"
            trend="+15% from last month"
          />
          <MetricCard
            label="Avg Order Value"
            value={
              stats?.totalOrders
                ? `₹${Math.round((stats.totalRevenue ?? 0) / stats.totalOrders).toLocaleString("en-IN")}`
                : "₹0"
            }
            loading={loadingStats}
            icon={<TrendingUp className="w-5 h-5 text-green-600" />}
            iconBg="bg-green-100"
            trend="Based on paid orders"
          />
        </div>

        {/* ── Analytics Tabs ── */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 ">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Products */}
          <TabsContent value="products">
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Products</CardTitle>
                  <CardDescription>Manage your inventory and update details.</CardDescription>
                </div>
                <Button onClick={() => {
                  if (isGuestMode) {
                    toast({
                      title: "Guest Mode 🔒",
                      description: "Artisan account required to create product listings. Please sign in or switch your role.",
                      variant: "destructive"
                    });
                    return;
                  }
                  setIsSellOptionsOpen(true);
                }}>Add New Product</Button>
              </CardHeader>
              <CardContent>
                {loadingProducts ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse bg-slate-50/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-200 rounded" />
                          <div className="space-y-2">
                            <div className="h-4 w-36 bg-slate-200 rounded" />
                            <div className="h-3.5 w-24 bg-slate-100 rounded" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-20 bg-slate-200 rounded-md" />
                          <div className="h-8 w-16 bg-slate-200 rounded-md" />
                          <div className="h-8 w-16 bg-slate-200 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No products listed yet.</p>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <img src={product.images?.[0]?.url || "/placeholder.png"} alt={product.name} className="w-12 h-12 rounded object-cover" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ₹{product.price} • Stock: {product.stock || 0}
                              {!product.isActive && <span className="ml-2 text-red-500 font-semibold">(Discontinued)</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleToggleActive(product)}
                          >
                            {product.isActive === false ? "Activate" : "Discontinue"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product);
                              setEditForm({
                                name: product.name,
                                description: product.description || "",
                                price: product.price,
                                category: product.category,
                                stock: product.stock ?? 1
                              });
                            }}
                          >
                            Update
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={isDeleting === product._id}
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            {isDeleting === product._id ? "..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Sales Trend</CardTitle>
                  <CardDescription>Monthly sales for selected product</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <ChartContainer config={chartConfig} className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredProductData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>Estimated sales per product</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="productName" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="sales" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueData.length === 0 ? (
                  <EmptyChart message="No revenue data yet" />
                ) : (
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                  <CardDescription>Breakdown by customer type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={customerTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ type, value }) => `${type}: ${value}%`}
                        >
                          {customerTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customers */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
                <CardDescription>Understanding your customer base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {loadingStats ? "—" : stats?.totalOrders ?? 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <ShoppingCart className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold">—</p>
                    <p className="text-sm text-muted-foreground">Avg Orders / Customer</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {loadingStats
                        ? "—"
                        : stats?.totalOrders
                        ? `₹${Math.round((stats.totalRevenue ?? 0) / stats.totalOrders).toLocaleString("en-IN")}`
                        : "₹0"}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  </div>
                </div>

                <div className="h-[300px]">
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={customerTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          dataKey="value"
                        >
                          {customerTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regions */}
          <TabsContent value="regions">
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>Sales distribution across regions (placeholder)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="orders" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest 5 orders for your products</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse bg-slate-50/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                            <div className="h-3.5 w-28 bg-slate-100 rounded animate-pulse" />
                          </div>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="h-4 w-16 bg-slate-200 rounded ml-auto animate-pulse" />
                          <div className="h-5 w-20 bg-slate-100 rounded ml-auto animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {order.items[0]?.name}
                              {order.items.length > 1 && (
                                <span className="text-muted-foreground text-sm ml-1">
                                  +{order.items.length - 1} more
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.buyer?.name} • {order.orderNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₹{order.pricing.total.toLocaleString("en-IN")}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${STATUS_STYLES[order.status] ?? ""}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Suggestions — static for now */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>AI-Powered Suggestions</span>
            </CardTitle>
            <CardDescription>Recommendations to boost your sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-medium text-blue-900">Inventory Alert</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Check your stock levels — low inventory can cause missed sales.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-medium text-green-900">Pricing Opportunity</h4>
                <p className="text-sm text-green-700 mt-1">
                  Similar products may be priced higher. Review your pricing strategy.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-medium text-purple-900">Marketing Insight</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Add SEO tags to your products to improve discoverability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isSellOptionsOpen} onOpenChange={setIsSellOptionsOpen}>
        <SellOptionsDialog />
      </Dialog>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                required
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input 
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input 
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({...editForm, stock: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editForm.category} onValueChange={(val) => setEditForm({...editForm, category: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pottery">Pottery</SelectItem>
                    <SelectItem value="Textiles">Textiles</SelectItem>
                    <SelectItem value="Jewelry">Jewelry</SelectItem>
                    <SelectItem value="Woodwork">Woodwork</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Home">Home Decor</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" disabled={isSaving} onClick={() => setEditingProduct(null)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────

const MetricCard = ({
  label,
  value,
  loading,
  icon,
  iconBg,
  trend,
}: {
  label: string;
  value: string;
  loading: boolean;
  icon: React.ReactNode;
  iconBg: string;
  trend: string;
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm">{label}</p>
          {loading ? (
            <div className="h-8 w-24 bg-slate-200 animate-pulse rounded-md mt-1.5" />
          ) : (
            <p className="text-2xl font-bold text-foreground mt-1">
              {value}
            </p>
          )}
          {loading ? (
            <div className="h-4 w-32 bg-slate-100 animate-pulse rounded-md mt-2" />
          ) : (
            <p className="text-sm text-green-600 flex items-center mt-1.5">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const EmptyChart = ({ message }: { message: string }) => (
  <div className="h-[300px] flex items-center justify-center">
    <p className="text-muted-foreground text-sm">{message}</p>
  </div>
);

export default SellerDashboard;