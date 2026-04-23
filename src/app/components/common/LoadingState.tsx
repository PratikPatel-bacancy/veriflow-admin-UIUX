export default function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 border-4 border-[#e5e7eb] border-t-[#3b82f6] rounded-full animate-spin" />
        <p className="text-[#6b7280] text-sm">Loading...</p>
      </div>
    </div>
  );
}
