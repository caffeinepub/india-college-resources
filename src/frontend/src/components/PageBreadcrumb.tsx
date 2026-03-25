import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
      {items.map((item, idx) => (
        <span key={item.label} className="flex items-center gap-1">
          {idx === 0 && <Home className="h-3.5 w-3.5" />}
          {item.onClick ? (
            <button
              type="button"
              onClick={item.onClick}
              className="hover:text-primary transition-colors font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-foreground font-semibold">{item.label}</span>
          )}
          {idx < items.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
        </span>
      ))}
    </nav>
  );
}
