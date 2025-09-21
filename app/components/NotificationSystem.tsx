"use client"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Clock, TrendingUp } from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "update";
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationSystemProps {
  onDataUpdate: () => void;
}

export function NotificationSystem({ onDataUpdate }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simulate real-time notifications
  useEffect(() => {
    const notifications = [
      {
        type: "success" as const,
        title: "Project Completed",
        message: "Mobile App Development has been marked as completed!",
        delay: 3000,
      },
      {
        type: "update" as const,
        title: "Progress Update",
        message: "E-commerce Redesign progress increased to 85%",
        delay: 8000,
      },
      {
        type: "warning" as const,
        title: "Deadline Approaching",
        message: "API Integration deadline is in 2 days",
        delay: 12000,
      },
      {
        type: "info" as const,
        title: "New Team Member",
        message: "John Smith joined the User Research Study project",
        delay: 18000,
      },
      {
        type: "success" as const,
        title: "Budget Approved",
        message: "Additional $5,000 approved for Brand Identity Update",
        delay: 25000,
      },
    ];

    const timeouts = notifications.map((notification, index) => {
      return setTimeout(() => {
        const newNotification: Notification = {
          id: `notif-${Date.now()}-${index}`,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          timestamp: new Date(),
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);

        // Show toast notification
        const icon = getNotificationIcon(notification.type);
        toast(notification.title, {
          description: notification.message,
          icon,
          duration: 4000,
        });

        // Trigger data update for certain notification types
        if (notification.type === "success" || notification.type === "update") {
          setTimeout(onDataUpdate, 500);
        }
      }, notification.delay);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [onDataUpdate]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "info":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "update":
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return null; // This component doesn't render anything visible
}