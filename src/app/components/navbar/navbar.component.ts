import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { AuthService } from "../../services/auth.service";
import { BookService } from "../../services/book.service";
import { AuthorService } from "../../services/author.service";
import { OrderService } from "../../services/order.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  isAuthenticated = false;
  booksCount = 0;
  authorsCount = 0;
  ordersCount = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private bookService: BookService,
    private authorService: AuthorService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });

    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    // Load counts
    this.loadCounts();

    // Refresh counts when navigating
    this.router.events.subscribe(() => {
      this.loadCounts();
    });
  }

  loadCounts(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.booksCount = books.length;
      },
      error: (err) => console.error("Error loading books count:", err),
    });

    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authorsCount = authors.length;
      },
      error: (err) => console.error("Error loading authors count:", err),
    });

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.ordersCount = orders.length;
      },
      error: (err) => console.error("Error loading orders count:", err),
    });
  }

  openCart(): void {
    // Emit event to open cart modal
    const event = new CustomEvent("openCart");
    window.dispatchEvent(event);
  }

  navigateToAccount(): void {
    if (this.isAuthenticated) {
      this.router.navigate(["/account"]);
    } else {
      this.router.navigate(["/login"]);
    }
  }
}
