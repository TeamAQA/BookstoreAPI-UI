import { Component, OnInit } from "@angular/core";
import {
  NotificationService,
  Notification,
} from "../../services/notification.service";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe((notification) => {
      this.notifications.push(notification);

      // Auto remove after 5 seconds
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 5000);
    });
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }
}
