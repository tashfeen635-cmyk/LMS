"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/auth-store";
import useNotificationStore from "@/stores/notification-store";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

const PORTAL_COLOR = "#3b82f6";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { loadNotifications } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.replace("/login");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (user) loadNotifications(user.id);
  }, [user, loadNotifications]);

  if (!isAuthenticated || user?.role !== "student") return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar portalColor={PORTAL_COLOR} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar portalColor={PORTAL_COLOR} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
