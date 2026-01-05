import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  credentials = {
    username: "",
    password: "",
  };

  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onSubmit(): void {
    if (
      !this.credentials.username.trim() ||
      !this.credentials.password.trim()
    ) {
      this.notificationService.warning("Please fill in all fields");
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.notificationService.success("Login successful!");
        this.router.navigate(["/account"]);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error("Login error:", error);
        if (error.status === 400 || error.status === 401) {
          this.notificationService.error("Invalid username or password");
        } else {
          this.notificationService.error("Login failed. Please try again.");
        }
        this.isSubmitting = false;
      },
    });
  }
}
