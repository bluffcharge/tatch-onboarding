type Props = {
  current: number;
  total: number;
  className?: string;
};

export function StepperBar({ current, total, className = "" }: Props) {
  const pct = Math.min(1, Math.max(0, current / total));
  return (
    <div className={"w-full " + className}>
      <div
        className="relative h-1 w-full overflow-hidden rounded-pill bg-border-subtle"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Step ${current} of ${total}`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-pill bg-royal-400 transition-[width] duration-slow ease-snap"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
