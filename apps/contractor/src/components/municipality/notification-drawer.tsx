import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getOfficerNotifications, markNotificationRead } from "@/services/api";
import type { OfficerNotification } from "@/services/types";
import { cn } from "@/lib/utils";

export function NotificationDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [notifications, setNotifications] = useState<OfficerNotification[]>([]);

  useEffect(() => {
    if (open) {
      getOfficerNotifications().then(setNotifications);
    }
  }, [open]);

  async function handleRead(id: string) {
    await markNotificationRead(id);
    setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="glass-strong w-full border-l border-[var(--glass-border)] sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <ul className="mt-6 space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={cn(
                "animate-rise rounded-xl border border-[var(--glass-border)] p-4 transition-colors",
                !n.read && "bg-[var(--glass)]",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-2 text-[0.65rem] text-subtle">
                    {formatDistanceToNow(new Date(n.at), { addSuffix: true })}
                  </p>
                </div>
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => handleRead(n.id)}
                    className="shrink-0 text-[0.65rem] text-primary hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
              {n.link && (
                <Link
                  to={n.link as any}
                  onClick={() => onOpenChange(false)}
                  className="mt-2 inline-block text-xs text-primary hover:underline"
                >
                  View details
                </Link>
              )}
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
