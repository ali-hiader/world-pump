export type Product = {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string;
  gallery: string[] | null;
  price: number;
  discountPrice?: number | null;
  pumpType: string;
  horsepower?: string | null;
  flowRate?: string | null;
  head?: string | null;
  voltage?: string | null;
  warranty?: string | null;
  message: string;
  createdBy: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export interface CartProduct {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  message: string;
  createdBy: string;
  cartId: number;
  quantity: number;
}

export interface Order {
  id: number;
  userEmail: string;
  sessionId: string;
  totalAmount: number;
  status: string;
  createdAt: Date | null;
}

export interface OrderItem {
  id: number;
  orderId: number | null;
  productName: string;
  quantity: number;
  price: number;
}
