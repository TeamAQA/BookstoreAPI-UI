import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
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
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly bookService: BookService,
    private readonly authorService: AuthorService,
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });

    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    // Refresh counts when navigating (also fires on initial navigation)
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
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
