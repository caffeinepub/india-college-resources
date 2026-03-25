import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { motion } from "motion/react";
import type { College, Subject } from "../backend";
import { PageBreadcrumb } from "../components/PageBreadcrumb";
import { useSubjectsByYear } from "../hooks/useQueries";

interface YearDetailPageProps {
  college: College;
  year: bigint;
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

const SKELETONS = ["a", "b", "c"];

export function YearDetailPage({
  college,
  year,
  onNavigate,
}: YearDetailPageProps) {
  const { data: subjects, isLoading } = useSubjectsByYear(year);

  const bySemester: Record<string, Subject[]> = {};
  for (const sub of subjects ?? []) {
    const key = `Semester ${sub.semester.toString()}`;
    if (!bySemester[key]) bySemester[key] = [];
    bySemester[key].push(sub);
  }

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
          {
            label: college.name,
            onClick: () => onNavigate("college-detail", { college }),
          },
          { label: year.toString() },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {year.toString()}
        </h1>
        <p className="text-muted-foreground">{college.name} — Subjects</p>
      </div>

      {isLoading ? (
        <div data-ocid="year_detail.loading_state">
          {SKELETONS.map((k) => (
            <Skeleton key={k} className="h-48 rounded-xl mb-4" />
          ))}
        </div>
      ) : Object.keys(bySemester).length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="year_detail.empty_state"
        >
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">
            No subjects available for this year
          </p>
        </div>
      ) : (
        Object.entries(bySemester)
          .sort()
          .map(([semester, subs]) => (
            <div key={semester} className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                {semester}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subs.map((subject, idx) => (
                  <motion.button
                    type="button"
                    key={subject.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() =>
                      onNavigate("subject-detail", { college, year, subject })
                    }
                    className="p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-card transition-all cursor-pointer flex items-center gap-3 text-left w-full"
                    data-ocid={`year_detail.subject.item.${idx + 1}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {subject.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {subject.code}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
}
