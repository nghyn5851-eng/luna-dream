export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  sizes: string[];
  stock: number;
  featured?: boolean;
  highlighted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName?: string;
  role: 'customer' | 'admin';
  createdAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  customerInfo: {
    fullName: string;
    address: string;
    phone: string;
    note?: string;
  };
  createdAt: any;
}

export interface WebsiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  philosophyTitle: string;
  philosophyText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}
