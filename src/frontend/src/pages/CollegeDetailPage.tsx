import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, CalendarDays } from "lucide-react";
import { motion } from "motion/react";
import type { College } from "../backend";
import { CollegeTypeBadge } from "../components/CollegeTypeBadge";
import { PageBreadcrumb } from "../components/PageBreadcrumb";
import { STATE_EMOJI } from "../data/indiaData";
import { useAllYears } from "../hooks/useQueries";

interface CollegeDetailPageProps {
  college: College;
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

const SKELETONS = ["a", "b", "c", "d", "e", "f"];

export function CollegeDetailPage({
  college,
  onNavigate,
}: CollegeDetailPageProps) {
  const { data: years, isLoading } = useAllYears();

  const sortedYears = [...(years ?? [])].sort((a, b) => Number(b) - Number(a));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", onClick: () => onNavigate("home") },
          { label: "States", onClick: () => onNavigate("states") },
          {
            label: college.state,
            onClick: () => onNavigate("state-detail", { state: college.state }),
          },
          { label: college.name },
        ]}
      />

      <div className="mt-6 mb-10 p-6 rounded-2xl bg-hero-bg border border-border">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{STATE_EMOJI[college.state] ?? "🏛️"}</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {college.name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <CollegeTypeBadge type={college.collegeType} />
              <span className="text-sm text-muted-foreground">
                {college.state}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Academic Years
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Select a year to view available subjects
        </p>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          data-ocid="college_detail.loading_state"
        >
          {SKELETONS.map((k) => (
            <Skeleton key={k} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : sortedYears.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="college_detail.empty_state"
        >
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No years available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sortedYears.map((year, idx) => (
            <motion.button
              type="button"
              key={year.toString()}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onNavigate("year-detail", { college, year })}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:bg-blue-50 hover:shadow-card transition-all cursor-pointer text-center w-full"
              data-ocid={`college_detail.year.item.${idx + 1}`}
            >
              <CalendarDays className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {year.toString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Academic Year
              </p>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
