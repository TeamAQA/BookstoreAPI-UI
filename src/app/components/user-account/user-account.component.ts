import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "app-user-account",
  templateUrl: "./user-account.component.html",
  styleUrls: ["./user-account.component.css"],
})
export class UserAccountComponent implements OnInit {
  user: any = null;
  token: string | null = null;
  showToken = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"]);
      return;
    }

    this.user = this.authService.getUser();
    this.token = this.authService.getToken();

    // Debug - sprawdź co jest w localStorage
    console.log("User data:", this.user);
    console.log("Token:", this.token);

    // Jeśli nie ma danych użytkownika, użyj fake danych
    if (!this.user) {
      this.user = {
        id: 1,
        username: "admin",
        email: "admin@bookstore.com",
        firstName: "Admin",
        lastName: "User",
      };
    }
  }

  toggleTokenVisibility(): void {
    this.showToken = !this.showToken;
  }

  copyToken(): void {
    if (this.token) {
      navigator.clipboard.writeText(this.token).then(() => {
        this.notificationService.success("Token copied to clipboard!");
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.info("You have been logged out");
    this.router.navigate(["/login"]);
  }
}
