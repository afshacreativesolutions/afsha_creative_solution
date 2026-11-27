"use client";

import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { resolveActiveAdminSection } from "@/lib/admin-navigation";
import AdminHeader from "./AdminHeader";
import AdminMobileDrawer from "./AdminMobileDrawer";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/admin";
  const [drawerState, setDrawerState] = useState<{ open: boolean; openedPath: string }>({
    open: false,
    openedPath: "",
  });
  const [manualCollapsed, setManualCollapsed] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const isMobileDrawerOpen = drawerState.open && drawerState.openedPath === pathname;

  const openMobileDrawer = useCallback(() => {
    setDrawerState({ open: true, openedPath: pathname });
  }, [pathname]);

  const closeMobileDrawer = useCallback(() => {
    setDrawerState((prev) => ({ ...prev, open: false }));
  }, []);

  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        {children}
      </div>
    );
  }

  const active = resolveActiveAdminSection(pathname);
  const sidebarCollapsed = active.isVisualEditor || manualCollapsed;

  return (
    <div className="flex min-h-screen bg-[#080808] text-white">
      <AdminSidebar pathname={pathname} collapsed={sidebarCollapsed} />

      <AdminMobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={closeMobileDrawer}
        pathname={pathname}
        returnFocusRef={menuButtonRef}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          pathname={pathname}
          mobileOpen={isMobileDrawerOpen}
          onOpenMobileDrawer={openMobileDrawer}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setManualCollapsed((c) => !c)}
          menuButtonRef={menuButtonRef}
        />
        <div className="min-w-0 flex-1 pb-[env(safe-area-inset-bottom)]">{children}</div>
      </div>
    </div>
  );
}
