import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  isAuthenticated = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });

    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
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
