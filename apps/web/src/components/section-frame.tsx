import { cn } from "@flowlined-web/ui/lib/utils";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import "./section-frame.css";

type SectionFrameProps<T extends ElementType = "section"> = {
  as?: T;
  frameClassName?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export default function SectionFrame<T extends ElementType = "section">({
  as,
  className,
  frameClassName,
  children,
  ...props
}: SectionFrameProps<T>) {
  const Tag = as ?? ("section" as ElementType);

  return (
    <Tag className={cn("section-shell", className)} {...props}>
      <div className={cn("section-frame", frameClassName)}>{children}</div>
    </Tag>
  );
}
