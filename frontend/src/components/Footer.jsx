export default function Footer() {
  return (
    <footer className="border-t mt-12 py-6 bg-white/70">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="h-8 w-8" />
          <span>Nursing Students Guide</span>
        </div>
        <span className="text-xs">Powered by the existing design system • Data via API</span>
      </div>
    </footer>
  );
}
