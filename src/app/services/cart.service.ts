import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Book, CartItem } from "../models/book.model";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(book: Book, quantity: number = 1): void {
    const existingItem = this.cartItems.find(
      (item) => item.book.id === book.id
    );

    if (existingItem) {
      if (existingItem.quantity + quantity <= book.available) {
        existingItem.quantity += quantity;
      }
    } else {
      this.cartItems.push({ book, quantity });
    }

    this.saveCartToStorage();
    this.cartSubject.next(this.cartItems);
  }

  removeFromCart(bookId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.book.id !== bookId);
    this.saveCartToStorage();
    this.cartSubject.next(this.cartItems);
  }

  updateQuantity(bookId: number, quantity: number): void {
    const item = this.cartItems.find((item) => item.book.id === bookId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(bookId);
      } else if (quantity <= item.book.available) {
        item.quantity = quantity;
        this.saveCartToStorage();
        this.cartSubject.next(this.cartItems);
      }
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getCartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCartToStorage();
    this.cartSubject.next(this.cartItems);
  }

  isInCart(bookId: number): boolean {
    return this.cartItems.some((item) => item.book.id === bookId);
  }

  private saveCartToStorage(): void {
    localStorage.setItem("bookstore_cart", JSON.stringify(this.cartItems));
  }

  private loadCartFromStorage(): void {
    const saved = localStorage.getItem("bookstore_cart");
    if (saved) {
      try {
        this.cartItems = JSON.parse(saved);
        this.cartSubject.next(this.cartItems);
      } catch (error) {
        console.error("Error loading cart from storage:", error);
      }
    }
  }
}
