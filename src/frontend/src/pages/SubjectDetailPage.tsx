import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Download, FileText } from "lucide-react";
import { motion } from "motion/react";
import type { College, Resource, Subject } from "../backend";
import { PageBreadcrumb } from "../components/PageBreadcrumb";
import { useResourcesBySubject } from "../hooks/useQueries";

interface SubjectDetailPageProps {
  college: College;
  year: bigint;
  subject: Subject;
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

function downloadResource(resource: Resource) {
  if (!resource.file) return;
  const arr = resource.file as unknown as Uint8Array;
  const blob = new Blob([arr.buffer as ArrayBuffer], {
    type: "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${resource.title}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

const RESOURCE_TYPE_ICON: Record<string, string> = {
  Notes: "📝",
  "Previous Year Paper": "📄",
  Syllabus: "📋",
  Assignment: "✏️",
};

const SKELETONS = ["a", "b", "c", "d"];

export function SubjectDetailPage({
  college,
  year,
  subject,
  onNavigate,
}: SubjectDetailPageProps) {
  const { data: resources, isLoading } = useResourcesBySubject(subject.id);

  const notes = (resources ?? []).filter(
    (r: Resource) => r.resourceType === "Notes",
  );
  const papers = (resources ?? []).filter(
    (r: Resource) => r.resourceType === "Previous Year Paper",
  );
  const others = (resources ?? []).filter(
    (r: Resource) =>
      r.resourceType !== "Notes" && r.resourceType !== "Previous Year Paper",
  );

  const ResourceCard = ({
    resource,
    idx,
  }: { resource: Resource; idx: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all"
      data-ocid={`subject_detail.resource.item.${idx + 1}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          {RESOURCE_TYPE_ICON[resource.resourceType] ?? "📁"}
        </span>
        <div>
          <p className="font-medium text-foreground">{resource.title}</p>
          <p className="text-xs text-muted-foreground">
            Uploaded by {resource.uploadedBy}
          </p>
        </div>
      </div>
      {resource.file && resource.file.length > 0 ? (
        <Button
          size="sm"
          className="rounded-full gap-1.5"
          onClick={() => downloadResource(resource)}
          data-ocid={`subject_detail.download_button.${idx + 1}`}
        >
          <Download className="h-3.5 w-3.5" /> Download
        </Button>
      ) : (
        <Badge variant="secondary">Preview Only</Badge>
      )}
    </motion.div>
  );

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
          {
            label: year.toString(),
            onClick: () => onNavigate("year-detail", { college, year }),
          },
          { label: subject.name },
        ]}
      />

      <div className="mt-6 mb-8 p-6 rounded-2xl bg-hero-bg border border-border">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {subject.name}
            </h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-sm text-muted-foreground font-mono">
                {subject.code}
              </span>
              <Badge variant="secondary">
                Semester {subject.semester.toString()}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {year.toString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div data-ocid="subject_detail.loading_state">
          {SKELETONS.map((k) => (
            <Skeleton key={k} className="h-16 rounded-xl mb-3" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="notes">
          <TabsList className="mb-6">
            <TabsTrigger value="notes" data-ocid="subject_detail.notes.tab">
              <FileText className="h-4 w-4 mr-1.5" /> Notes ({notes.length})
            </TabsTrigger>
            <TabsTrigger value="papers" data-ocid="subject_detail.papers.tab">
              <FileText className="h-4 w-4 mr-1.5" /> Previous Papers (
              {papers.length})
            </TabsTrigger>
            {others.length > 0 && (
              <TabsTrigger value="others" data-ocid="subject_detail.others.tab">
                Others ({others.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="notes">
            {notes.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="subject_detail.notes.empty_state"
              >
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No notes uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((r, i) => (
                  <ResourceCard key={r.id} resource={r} idx={i} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="papers">
            {papers.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="subject_detail.papers.empty_state"
              >
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No previous year papers uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {papers.map((r, i) => (
                  <ResourceCard key={r.id} resource={r} idx={i} />
                ))}
              </div>
            )}
          </TabsContent>

          {others.length > 0 && (
            <TabsContent value="others">
              <div className="space-y-3">
                {others.map((r, i) => (
                  <ResourceCard key={r.id} resource={r} idx={i} />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
