export interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Book {
  id: number;
  title: string;
  isbn?: string;
  year?: number;
  price: number;
  available: number;
  category?: string;
  coverUrl?: string;
  authors: Author[];
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  id: number;
  book: Book;
  quantity: number;
}

export interface Recipient {
  id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
  email: string;
}

export interface Order {
  id: number;
  status: string;
  items: OrderItem[];
  recipient: Recipient;
}
