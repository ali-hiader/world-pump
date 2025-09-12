export interface UserProduct {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  productDetail: string;
  message: string;
  createdBy: number;
  user: {
    id: number;
    name: string;
    image: string;
    email: string;
  };
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  message: string;
  createdBy: string;
}

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
