import {
  Boxes,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  PackageSearch,
  Settings,
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

export const cmsNavigation: CmsNavGroup[] = [
  {
    title: "Tổng quan",
    items: [{ title: "Dashboard", href: "/cms", icon: LayoutDashboard }],
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
        ],
      },
      { title: "Đơn hàng", href: "/cms/orders", icon: ShoppingBag },
      { title: "Yêu cầu báo giá", href: "/cms/quotations", icon: ClipboardList },
    ],
  },
  {
    title: "Hệ thống",
    items: [{ title: "Cài đặt", href: "/cms/settings/appearance", icon: Settings }],
  },
];

export function isCmsRouteActive(pathname: string, href: string) {
  if (href === "/cms") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
