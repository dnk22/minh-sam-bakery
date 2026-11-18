import type { ComponentProps } from "react";

import { cn } from "@/cms/lib/cn";

export function CmsMain({ className, fixed = false, fluid = false, ...props }: ComponentProps<"main"> & { fixed?: boolean; fluid?: boolean }) {
  return (
    <main
      className={cn("cms-main", fixed && "cms-main--fixed", fluid && "cms-main--fluid", className)}
      data-layout={fixed ? "fixed" : "auto"}
      id="cms-main-content"
      {...props}
    />
  );
}
