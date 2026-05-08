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
  // LineChart,
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
  // Line,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
// import { Select, SelectItem } from "@/components/ui/select";
import { getSellerOrders, getSellerStats } from "@/api/order";
// import { getMyProducts } from "@/api/product";

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

const SellerDashboard = () => {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  // const [products, setProducts] = useState([]);
  // const [selectedProduct, setSelectedProduct] = useState("");
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  // const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user || user.role !== "seller") {
      navigate("/");
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    if (!user || user.role !== "seller") return;

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
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== "seller") return;

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
  }, [user]);

  // useEffect(() => {
  //   if (!user || user.role !== "seller") return;

  //   const fetchProducts = async () => {
  //     try {
  //       const res = await getMyProducts();
  //       setProducts(res.data.products || []);
  //     } catch (err) {
  //       console.error("Products fetch failed:", err);
  //       setProducts([]);
  //     } finally {
  //       setLoadingProducts(false);
  //     }
  //   };

  //   fetchProducts();
  // }, [user]);
  
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "seller") return null;

  const revenueData: RevenuePoint[] = stats?.revenueChart ?? [];

  // const filteredProductData = [];
  // const productComparisonData = [];
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
                Welcome back, {user.name}! Here's your business overview.
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                user.isSellerVerified
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-yellow-100 text-yellow-700 border-yellow-300"
              }
            >
              <Star className="w-3 h-3 mr-1" />
              {user.isSellerVerified ? "Verified Artisan" : "Pending Verification"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Verification banner */}
      {!user.isSellerVerified && (
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
      )}

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
          <TabsList className="grid w-full grid-cols-5">
            {/* <TabsTrigger value="products">Products</TabsTrigger> */}
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Products */}
          {/* <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Sales Trend</CardTitle>
                  <CardDescription>Monthly sales for selected product</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={setSelectedProduct}>
                    {products.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <ChartContainer config={chartConfig} className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredProductData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>Total sales per product</CardDescription>
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
          </TabsContent> */}


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
                    <ChartContainer config={chartConfig} className="h-[300px]">
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
                  <p className="text-muted-foreground text-sm">Loading orders...</p>
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
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-2xl font-bold text-foreground">
            {loading ? "—" : value}
          </p>
          <p className="text-sm text-green-600 flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            {trend}
          </p>
        </div>
        <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}>
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