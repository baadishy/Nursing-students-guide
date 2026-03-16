export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
