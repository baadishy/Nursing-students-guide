export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm border border-border/60 ${className}`}>
      {children}
    </div>
  );
}
