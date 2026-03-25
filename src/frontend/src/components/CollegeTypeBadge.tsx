import { COLLEGE_TYPE_COLORS } from "../data/indiaData";

interface CollegeTypeBadgeProps {
  type: string;
  size?: "sm" | "md";
}

export function CollegeTypeBadge({ type, size = "md" }: CollegeTypeBadgeProps) {
  const colorClass =
    COLLEGE_TYPE_COLORS[type] ?? "bg-gray-100 text-gray-800 border-gray-200";
  const sizeClass =
    size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colorClass} ${sizeClass}`}
    >
      {type}
    </span>
  );
}
