export type AdminIconName =
  | "dashboard"
  | "leads"
  | "customers"
  | "analytics"
  | "campaigns"
  | "messages"
  | "consent"
  | "products"
  | "categories"
  | "blog"
  | "content"
  | "media"
  | "settings"
  | "integrations";

export type AdminNavChild = {
  href: string;
  label: string;
  icon: AdminIconName;
  exact?: boolean;
};

export type AdminNavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: AdminIconName;
  exact?: boolean;
  children?: AdminNavChild[];
};

export type AdminNavGroup = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: "crm",
    label: "CRM & Pipeline",
    items: [
      { href: "/admin", label: "Overview", icon: "dashboard", exact: true },
      { href: "/admin/leads", label: "Lead Inbox", shortLabel: "Leads", icon: "leads" },
      { href: "/admin/customers", label: "Customers", icon: "customers" },
    ],
  },
  {
    id: "insights",
    label: "Insights & Outreach",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
      { href: "/admin/campaigns", label: "Campaigns", icon: "campaigns" },
      { href: "/admin/messages", label: "Message Logs", shortLabel: "Messages", icon: "messages" },
      { href: "/admin/consent", label: "Consent Audit", shortLabel: "Consent", icon: "consent" },
    ],
  },
  {
    id: "catalog",
    label: "Catalog & Editorial",
    items: [
      { href: "/admin/products", label: "Products", icon: "products" },
      { href: "/admin/categories", label: "Categories", icon: "categories" },
      { href: "/admin/blog", label: "Blog & Guides", shortLabel: "Blog", icon: "blog" },
    ],
  },
  {
    id: "cms",
    label: "Website & System",
    items: [
      {
        href: "/admin/content",
        label: "Website Content",
        shortLabel: "Content",
        icon: "content",
        children: [
          { href: "/admin/content", label: "Pages", icon: "content", exact: true },
          { href: "/admin/content/media", label: "Media Library", icon: "media" },
          { href: "/admin/content/settings", label: "Site Settings", icon: "settings" },
        ],
      },
      { href: "/admin/settings/integrations", label: "Integrations", icon: "integrations" },
    ],
  },
];

export function isNavHrefActive(pathname: string, href: string, exact = false): boolean {
  if (!pathname) return false;
  if (href === "/admin/content" && exact) {
    return (
      pathname === "/admin/content" ||
      (pathname.startsWith("/admin/content/") &&
        !pathname.startsWith("/admin/content/media") &&
        !pathname.startsWith("/admin/content/settings"))
    );
  }
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function resolveActiveAdminSection(pathname: string): {
  title: string;
  groupLabel: string;
  isVisualEditor: boolean;
} {
  const isVisualEditor =
    pathname.startsWith("/admin/content/") &&
    !pathname.startsWith("/admin/content/media") &&
    !pathname.startsWith("/admin/content/settings");

  if (isVisualEditor) {
    return {
      title: "Visual Page Editor",
      groupLabel: "Website Content",
      isVisualEditor: true,
    };
  }

  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.children) {
        for (const child of item.children) {
          if (isNavHrefActive(pathname, child.href, child.exact)) {
            return {
              title: child.label,
              groupLabel: item.label,
              isVisualEditor: false,
            };
          }
        }
      }
      if (isNavHrefActive(pathname, item.href, item.exact)) {
        return {
          title: item.label,
          groupLabel: group.label,
          isVisualEditor: false,
        };
      }
    }
  }

  return {
    title: "Admin Console",
    groupLabel: "Afsha Executive Suite",
    isVisualEditor: false,
  };
}
