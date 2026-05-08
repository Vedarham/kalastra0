export interface OrderItem {
  _id: string;
  product: string;
  seller: {
    _id: string;
    name: string;
    shopName?: string;
    avatar?: string;
  };
  name: string;
  image: string;
  price: number;
  quantity: number;
  status: "processing" | "confirmed" | "cancelled";
}

export interface Order {
  _id: string;
  buyer: string;
  items: OrderItem[];
  status: "pending" | "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
  pricing: {
    total: number;
  };
  payment: {
    status: "pending" | "paid" | "failed";
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  createdAt: string;
}
