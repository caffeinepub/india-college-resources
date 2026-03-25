import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Building2, FileText, Search } from "lucide-react";
import { useState } from "react";
import type { College, Resource, Subject } from "../backend";
import { CollegeTypeBadge } from "../components/CollegeTypeBadge";
import { useDebounce } from "../hooks/useDebounce";
import {
  useSearchColleges,
  useSearchResources,
  useSearchSubjects,
} from "../hooks/useQueries";

interface SearchPageProps {
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

const SKELETONS = ["a", "b", "c", "d"];

export function SearchPage({ onNavigate }: SearchPageProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const { data: colleges, isLoading: cLoading } =
    useSearchColleges(debouncedQuery);
  const { data: subjects, isLoading: sLoading } =
    useSearchSubjects(debouncedQuery);
  const { data: resources, isLoading: rLoading } =
    useSearchResources(debouncedQuery);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Search Resources
      </h1>
      <p className="text-muted-foreground mb-8">
        Search across colleges, subjects, and materials
      </p>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          className="pl-12 h-12 rounded-full text-base"
          placeholder="Search for colleges, subjects, notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-ocid="search.search_input"
        />
      </div>

      {debouncedQuery.trim().length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">Start typing to search...</p>
        </div>
      ) : (
        <Tabs defaultValue="colleges">
          <TabsList className="mb-6">
            <TabsTrigger value="colleges" data-ocid="search.colleges.tab">
              <Building2 className="h-4 w-4 mr-1.5" />
              Colleges {cLoading ? "..." : `(${(colleges ?? []).length})`}
            </TabsTrigger>
            <TabsTrigger value="subjects" data-ocid="search.subjects.tab">
              <BookOpen className="h-4 w-4 mr-1.5" />
              Subjects {sLoading ? "..." : `(${(subjects ?? []).length})`}
            </TabsTrigger>
            <TabsTrigger value="resources" data-ocid="search.resources.tab">
              <FileText className="h-4 w-4 mr-1.5" />
              Resources {rLoading ? "..." : `(${(resources ?? []).length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colleges">
            {cLoading ? (
              <div data-ocid="search.colleges.loading_state">
                {SKELETONS.map((k) => (
                  <Skeleton key={k} className="h-16 rounded-xl mb-3" />
                ))}
              </div>
            ) : (colleges ?? []).length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="search.colleges.empty_state"
              >
                <p>No colleges found for &quot;{debouncedQuery}&quot;</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(colleges ?? []).map((college: College, idx: number) => (
                  <button
                    type="button"
                    key={college.id}
                    onClick={() =>
                      onNavigate("state-detail", { state: college.state })
                    }
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-card transition-all cursor-pointer text-left"
                    data-ocid={`search.college.item.${idx + 1}`}
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {college.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {college.state}
                      </p>
                    </div>
                    <CollegeTypeBadge type={college.collegeType} size="sm" />
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="subjects">
            {sLoading ? (
              <div data-ocid="search.subjects.loading_state">
                {SKELETONS.map((k) => (
                  <Skeleton key={k} className="h-16 rounded-xl mb-3" />
                ))}
              </div>
            ) : (subjects ?? []).length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="search.subjects.empty_state"
              >
                <p>No subjects found for &quot;{debouncedQuery}&quot;</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(subjects ?? []).map((subject: Subject, idx: number) => (
                  <div
                    key={subject.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                    data-ocid={`search.subject.item.${idx + 1}`}
                  >
                    <BookOpen className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        {subject.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {subject.code} · Year {subject.year.toString()} · Sem{" "}
                        {subject.semester.toString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resources">
            {rLoading ? (
              <div data-ocid="search.resources.loading_state">
                {SKELETONS.map((k) => (
                  <Skeleton key={k} className="h-16 rounded-xl mb-3" />
                ))}
              </div>
            ) : (resources ?? []).length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="search.resources.empty_state"
              >
                <p>No resources found for &quot;{debouncedQuery}&quot;</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(resources ?? []).map((resource: Resource, idx: number) => (
                  <div
                    key={resource.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                    data-ocid={`search.resource.item.${idx + 1}`}
                  >
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        {resource.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {resource.resourceType} · {resource.subject}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
