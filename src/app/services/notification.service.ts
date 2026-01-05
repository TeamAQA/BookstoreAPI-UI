import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface Notification {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notifications$ = new Subject<Notification>();
  private notificationId = 0;

  getNotifications() {
    return this.notifications$.asObservable();
  }

  show(
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) {
    const notification: Notification = {
      id: ++this.notificationId,
      message,
      type,
    };
    this.notifications$.next(notification);
  }

  success(message: string) {
    this.show(message, "success");
  }

  error(message: string) {
    this.show(message, "error");
  }

  info(message: string) {
    this.show(message, "info");
  }

  warning(message: string) {
    this.show(message, "warning");
  }
}
