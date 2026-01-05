import { Component, OnInit } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { OrderService } from "../../services/order.service";
import { NotificationService } from "../../services/notification.service";
import { CartItem } from "../../models/book.model";

@Component({
  selector: "app-cart-modal",
  templateUrl: "./cart-modal.component.html",
  styleUrls: ["./cart-modal.component.css"],
})
export class CartModalComponent implements OnInit {
  isOpen = false;
  showCheckoutForm = false;
  cartItems: CartItem[] = [];
  cartTotal = 0;
  isSubmitting = false;

  recipient = {
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });

    // Listen for cart modal open event from navbar
    window.addEventListener("openCart", () => {
      this.open();
    });
  }

  open(): void {
    this.isOpen = true;
    document.body.style.overflow = "hidden";
  }

  close(): void {
    this.isOpen = false;
    this.showCheckoutForm = false;
    document.body.style.overflow = "auto";
    this.resetForm();
  }

  updateQuantity(bookId: number, change: number): void {
    const item = this.cartItems.find((i) => i.book.id === bookId);
    if (item) {
      this.cartService.updateQuantity(bookId, item.quantity + change);
    }
  }

  removeFromCart(bookId: number): void {
    this.cartService.removeFromCart(bookId);
    this.notificationService.info("Book removed from cart");
  }

  getAuthorsText(item: CartItem): string {
    return item.book.authors
      .map((a) => `${a.firstName} ${a.lastName}`)
      .join(", ");
  }

  getItemTotal(item: CartItem): number {
    return item.book.price * item.quantity;
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      this.notificationService.warning("Your cart is empty");
      return;
    }
    this.showCheckoutForm = true;
  }

  closeCheckout(): void {
    this.showCheckoutForm = false;
    this.resetForm();
  }

  submitOrder(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Usuń kod kraju z numeru telefonu przed wysłaniem
    const cleanPhone = this.recipient.phone
      .replace(/^\+48\s*/, "") // Usuń +48 na początku
      .replace(/\s+/g, ""); // Usuń wszystkie spacje

    // Usuń prefiks "ul.", "Ul.", "ulica", "Ulica" z nazwy ulicy
    const cleanStreet = this.recipient.street
      .replace(/^(ul\.|Ul\.|ulica|Ulica)\s*/i, "") // Usuń prefiksy na początku (case-insensitive)
      .trim();

    const orderRequest = {
      items: this.cartItems.map((item) => ({
        bookId: item.book.id,
        quantity: item.quantity,
      })),
      recipient: {
        ...this.recipient,
        phone: cleanPhone,
        street: cleanStreet,
      },
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.notificationService.success("Order placed successfully!");
        this.cartService.clearCart();
        this.close();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error("Error creating order:", error);
        if (error.status === 400) {
          this.notificationService.error("Invalid data submitted");
        } else {
          this.notificationService.error("Failed to place order");
        }
        this.isSubmitting = false;
      },
    });
  }

  private validateForm(): boolean {
    if (!this.recipient.name.trim()) {
      this.notificationService.warning("Please enter your full name");
      return false;
    }
    if (
      !this.recipient.email.trim() ||
      !this.isValidEmail(this.recipient.email)
    ) {
      this.notificationService.warning("Please enter a valid email address");
      return false;
    }
    if (!this.recipient.phone.trim()) {
      this.notificationService.warning("Please enter your phone number");
      return false;
    }
    if (!this.recipient.street.trim()) {
      this.notificationService.warning("Please enter your street address");
      return false;
    }
    if (!this.recipient.city.trim()) {
      this.notificationService.warning("Please enter your city");
      return false;
    }
    if (!this.recipient.zipCode.trim()) {
      this.notificationService.warning("Please enter your zip code");
      return false;
    }
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetForm(): void {
    this.recipient = {
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      zipCode: "",
    };
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
