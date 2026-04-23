import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />}
          {item.path ? (
            <Link
              to={item.path}
              className="text-sm text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#e8eef5] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm text-[#111827] dark:text-[#e8eef5] font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
