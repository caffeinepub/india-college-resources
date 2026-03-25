import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { College } from "../backend";
import { CollegeTypeBadge } from "../components/CollegeTypeBadge";
import { PageBreadcrumb } from "../components/PageBreadcrumb";
import { COLLEGE_TYPES, STATE_EMOJI } from "../data/indiaData";
import { useCollegesByState } from "../hooks/useQueries";

interface StateDetailPageProps {
  state: string;
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

const SKELETONS = ["a", "b", "c", "d", "e", "f"];

export function StateDetailPage({ state, onNavigate }: StateDetailPageProps) {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("All");
  const { data: colleges, isLoading } = useCollegesByState(state);

  const filtered = (colleges ?? []).filter((c: College) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "All" || c.collegeType === activeType;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <PageBreadcrumb
        items={[
          { label: "Home", onClick: () => onNavigate("home") },
          { label: "States", onClick: () => onNavigate("states") },
          { label: state },
        ]}
      />

      <div className="mt-6 mb-8 flex items-center gap-4">
        <span className="text-5xl">{STATE_EMOJI[state] ?? "🏛️"}</span>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{state}</h1>
          <p className="text-muted-foreground">
            {(colleges ?? []).length} colleges found
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 rounded-full"
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="state_detail.search_input"
          />
        </div>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {["All", ...COLLEGE_TYPES].map((type) => (
          <Button
            key={type}
            size="sm"
            variant={activeType === type ? "default" : "outline"}
            className="rounded-full text-xs"
            onClick={() => setActiveType(type)}
            data-ocid="state_detail.filter.tab"
          >
            {type}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="state_detail.loading_state"
        >
          {SKELETONS.map((k) => (
            <Skeleton key={k} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="state_detail.empty_state"
        >
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No colleges found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((college: College, idx: number) => (
            <motion.button
              type="button"
              key={college.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => onNavigate("college-detail", { college })}
              className="p-5 rounded-xl border border-border bg-card hover:border-primary hover:shadow-card transition-all cursor-pointer text-left w-full"
              data-ocid={`state_detail.college.item.${idx + 1}`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-foreground leading-snug">
                  {college.name}
                </h3>
              </div>
              <CollegeTypeBadge type={college.collegeType} size="sm" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
