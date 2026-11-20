import { Plus } from "lucide-react";

import { CmsButton } from "@/cms/components/ui/button";

import styles from "./categories-header.module.css";

export function CategoriesHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <header className={styles.heading}>
      <div>
        <h1>Danh mục</h1>
        <p>
          Quản lý cấu trúc, trạng thái hiển thị và thông tin SEO của danh mục
          bánh.
        </p>
      </div>
      <CmsButton type="button" onClick={onCreate}>
        <Plus aria-hidden="true" size={17} /> Thêm danh mục
      </CmsButton>
    </header>
  );
}
