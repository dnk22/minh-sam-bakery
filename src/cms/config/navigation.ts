import {
  Boxes,
  FolderTree,
  FileText,
  LayoutDashboard,
  PackageSearch,
  ShieldCheck,
  UsersRound,
  Settings,
  Images,
  SlidersHorizontal,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export type CmsNavLink = {
  title: string;
  href: string;
  icon?: LucideIcon;
};

export type CmsNavItem = CmsNavLink | {
  title: string;
  icon?: LucideIcon;
  items: CmsNavLink[];
};

export type CmsNavGroup = {
  title: string;
  items: CmsNavItem[];
};

export type CmsBreadcrumbItem = {
  title: string;
  href: string;
  active: boolean;
};

export const cmsNavigation: CmsNavGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { title: "Dashboard", href: "/cms", icon: LayoutDashboard },
    ],
  },
  {
    title: "Quản lý cửa hàng",
    items: [
      {
        title: "Nội dung cửa hàng",
        icon: Boxes,
        items: [
          { title: "Danh mục", href: "/cms/categories", icon: FolderTree },
          { title: "Sản phẩm", href: "/cms/products", icon: PackageSearch },
          { title: "Bài viết", href: "/cms/posts", icon: FileText },
          { title: "Banner", href: "/cms/banners", icon: Images },
        ],
      },
      {
        title: "Đơn hàng",
        icon: ShoppingBag,
        items: [
          { title: "Chờ xác nhận", href: "/cms/orders/pending" },
          { title: "Đợi giao hàng", href: "/cms/orders/delivery" },
          { title: "Hoàn thành", href: "/cms/orders/completed" },
          { title: "Lịch sử", href: "/cms/orders/history" },
        ],
      },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { title: "Tài khoản", href: "/cms/users", icon: UsersRound },
      { title: "Vai trò & phân quyền", href: "/cms/roles", icon: ShieldCheck },
      { title: "Cấu hình hệ thống", href: "/cms/system-configs", icon: SlidersHorizontal },
      { title: "Cài đặt", href: "/cms/settings", icon: Settings },
    ],
  },
];

export function isCmsRouteActive(pathname: string, href: string) {
  if (href === "/cms") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function resolveCmsBreadcrumbs(pathname: string): CmsBreadcrumbItem[] {
  for (const group of cmsNavigation) {
    for (const item of group.items) {
      if (!("items" in item)) {
        if (isCmsRouteActive(pathname, item.href)) {
          return [
            { title: group.title, href: "/cms", active: false },
            { title: item.title, href: item.href, active: true },
          ];
        }
        continue;
      }

      for (const child of item.items) {
        if (isCmsRouteActive(pathname, child.href)) {
          return [
            { title: group.title, href: "/cms", active: false },
            { title: item.title, href: item.title === "Đơn hàng" ? "/cms/orders" : child.href, active: false },
            { title: child.title, href: child.href, active: true },
          ];
        }
      }
    }
  }

  if (pathname.startsWith("/cms/settings/")) {
    return [
      { title: "Hệ thống", href: "/cms", active: false },
      { title: "Cài đặt", href: "/cms/settings", active: false },
      { title: "Giao diện & hiển thị", href: "/cms/settings/display", active: true },
    ];
  }

  if (pathname === "/cms/notifications") {
    return [
      { title: "Tổng quan", href: "/cms", active: false },
      { title: "Thông báo", href: pathname, active: true },
    ];
  }

  const segments = pathname.split("/").filter(Boolean);
  const title = segments.at(-1) === "cms" ? "Dashboard" : segments.at(-1)?.replaceAll("-", " ") || "Dashboard";
  return [{ title: title.charAt(0).toLocaleUpperCase("vi-VN") + title.slice(1), href: pathname, active: true }];
}
