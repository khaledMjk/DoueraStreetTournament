export default function TeamBadge({ team, label, size = "md" }) {
  const dims = size === "sm" ? "h-7 w-7 text-xs" : "h-10 w-10 text-sm";
  const initials = (team?.shortName || label || "?").slice(0, 3).toUpperCase();
  const color = team?.color || "#28407e";

  return (
    <span
      className={`flex ${dims} shrink-0 items-center justify-center rounded-full font-extrabold text-white ring-2 ring-white shadow`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}
