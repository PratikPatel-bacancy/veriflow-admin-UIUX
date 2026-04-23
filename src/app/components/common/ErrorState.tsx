import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading this data. Please try again.",
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 text-[#ef4444]">
        <AlertTriangle className="size-16" />
      </div>
      <h3 className="font-semibold text-[#111827] text-lg mb-2">{title}</h3>
      <p className="text-[#6b7280] text-sm mb-6 text-center max-w-md">
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
