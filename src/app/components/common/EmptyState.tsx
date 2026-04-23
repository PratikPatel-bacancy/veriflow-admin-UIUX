import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 text-[#6b7280]">{icon}</div>
      <h3 className="font-semibold text-[#111827] text-lg mb-2">{title}</h3>
      <p className="text-[#6b7280] text-sm mb-6 text-center max-w-md">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
