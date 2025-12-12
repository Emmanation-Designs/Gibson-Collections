export interface Product {
  id: string;
  created_at: string;
  name: string;
  price: number;
  category: 'Baby Care' | 'Bags & Shoes' | 'Accessories' | 'Other';
  description: string;
  images: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  id: string;
  email: string;
}

export const ADMIN_EMAILS = [
  'gibsoncollections1@gmail.com',
  'gibsoncollections2@gmail.com'
];

export const CATEGORIES = ['Baby Care', 'Bags & Shoes', 'Accessories'];

export const WHATSAPP_NUMBER = '2348033464218';
