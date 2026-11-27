"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BookOpenText,
  ChevronDown,
  Cpu,
  FolderTree,
  Images,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  MailCheck,
  Megaphone,
  Package,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  ADMIN_NAV_GROUPS,
  isNavHrefActive,
  type AdminIconName,
} from "@/lib/admin-navigation";

const ICONS: Record<AdminIconName, React.ComponentType<{ size?: number; className?: string }>> = {
  dashboard: LayoutDashboard,
  leads: Inbox,
  customers: Users,
  analytics: BarChart3,
  campaigns: Megaphone,
  messages: MailCheck,
  consent: ShieldCheck,
  products: Package,
  categories: FolderTree,
  blog: BookOpenText,
  content: LayoutTemplate,
  media: Images,
  settings: Settings2,
  integrations: Cpu,
};

export default function AdminNavigation({
  pathname,
  collapsed = false,
  onNavigate,
  idPrefix = "nav",
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  idPrefix?: string;
}) {
  const router = useRouter();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [nestedExpanded, setNestedExpanded] = useState<boolean>(true);

  const toggleGroup = (id: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <nav aria-label="Admin sections" className="space-y-4">
      {ADMIN_NAV_GROUPS.map((group) => {
        const isGroupOpen = !collapsedGroups[group.id];
        return (
          <div key={group.id}>
            {!collapsed ? (
              <button
                type="button"
                aria-expanded={isGroupOpen}
                aria-controls={`${idPrefix}-group-${group.id}`}
                onClick={() => toggleGroup(group.id)}
                className="mb-1.5 flex min-h-8 w-full items-center justify-between px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 transition hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold/60"
              >
                <span>{group.label}</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${isGroupOpen ? "rotate-0" : "-rotate-90"}`}
                />
              </button>
            ) : (
              <div className="mx-3 my-2 h-px bg-white/10" aria-hidden="true" />
            )}

            {(collapsed || isGroupOpen) && (
              <ul id={`${idPrefix}-group-${group.id}`} className="space-y-1">
                {group.items.map((item) => {
                  const Icon = ICONS[item.icon];
                  const active = isNavHrefActive(pathname, item.href, item.exact);
                  const hasChildren = Boolean(item.children?.length);

                  return (
                    <li key={item.href}>
                      <div className="relative group/navitem flex items-center">
                        <Link
                          href={item.href}
                          prefetch={false}
                          aria-label={collapsed ? item.label : undefined}
                          aria-current={active && !hasChildren ? "page" : undefined}
                          onMouseEnter={() => router.prefetch(item.href)}
                          onClick={onNavigate}
                          className={`flex min-h-11 flex-1 items-center gap-3 rounded-lg px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold ${
                            collapsed ? "justify-center px-2" : ""
                          } ${
                            active
                              ? "border border-textGold/35 bg-textGold/15 text-textGold"
                              : "border border-transparent text-white/70 hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          <Icon size={17} className="shrink-0" />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>

                        {!collapsed && hasChildren && (
                          <button
                            type="button"
                            aria-label={`${nestedExpanded ? "Collapse" : "Expand"} ${item.label} submenu`}
                            aria-expanded={nestedExpanded}
                            onClick={() => setNestedExpanded((v) => !v)}
                            className="ml-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white/45 hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
                          >
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${
                                nestedExpanded ? "rotate-0" : "-rotate-90"
                              }`}
                            />
                          </button>
                        )}

                        {collapsed && (
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute left-full top-1/2 z-50 ml-2.5 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/15 bg-[#121212] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-xl transition-opacity group-hover/navitem:opacity-100 group-focus-within/navitem:opacity-100"
                          >
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!collapsed && hasChildren && nestedExpanded && (
                        <ul className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-3">
                          {item.children?.map((child) => {
                            const ChildIcon = ICONS[child.icon];
                            const childActive = isNavHrefActive(pathname, child.href, child.exact);
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  prefetch={false}
                                  aria-current={childActive ? "page" : undefined}
                                  onMouseEnter={() => router.prefetch(child.href)}
                                  onClick={onNavigate}
                                  className={`flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold ${
                                    childActive
                                      ? "bg-textGold/15 font-medium text-textGold"
                                      : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                                  }`}
                                >
                                  <ChildIcon size={14} className="shrink-0" />
                                  <span className="truncate">{child.label}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
