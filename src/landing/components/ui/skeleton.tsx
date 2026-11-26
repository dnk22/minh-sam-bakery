export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`motion-safe:animate-pulse rounded-md bg-surface-container-high ${className}`} />;
}
