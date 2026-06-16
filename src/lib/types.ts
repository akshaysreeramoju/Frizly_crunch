export interface Product {
  id: string;
  name: string;
  category: 'fruit' | 'vegetable';
  emoji: string;
  img: string;
  desc: string;
  benefits: string[];
  weight: string;
  price: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: string;
}
