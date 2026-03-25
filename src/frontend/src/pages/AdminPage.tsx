import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Building2,
  CalendarDays,
  Loader2,
  Plus,
  Shield,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  COLLEGE_TYPES,
  RESOURCE_TYPES,
  STATES_AND_UTS,
} from "../data/indiaData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddCollege,
  useAddState,
  useAddSubject,
  useAddYear,
  useIsAdmin,
  useUploadResource,
} from "../hooks/useQueries";

export function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const isLoggedIn = !!identity;

  // Add State
  const [newState, setNewState] = useState("");
  const addState = useAddState();

  // Add College
  const [collegeName, setCollegeName] = useState("");
  const [collegeState, setCollegeState] = useState("");
  const [collegeType, setCollegeType] = useState("");
  const addCollege = useAddCollege();

  // Add Year
  const [newYear, setNewYear] = useState("");
  const addYear = useAddYear();

  // Add Subject
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectYear, setSubjectYear] = useState("");
  const [subjectSemester, setSubjectSemester] = useState("");
  const addSubject = useAddSubject();

  // Upload Resource
  const [resTitle, setResTitle] = useState("");
  const [resSubject, setResSubject] = useState("");
  const [resType, setResType] = useState("");
  const [resFile, setResFile] = useState<File | null>(null);
  const uploadResource = useUploadResource();

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Admin Access
        </h1>
        <p className="text-muted-foreground mb-8">
          Login to manage colleges, subjects, and resources
        </p>
        <Button
          size="lg"
          className="rounded-full px-8"
          onClick={() => login()}
          disabled={loginStatus === "logging-in"}
          data-ocid="admin.login.primary_button"
        >
          {loginStatus === "logging-in" ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Access Denied
        </h1>
        <p className="text-muted-foreground mb-6">
          You don't have admin privileges.
        </p>
        <Button
          variant="outline"
          onClick={() => clear()}
          data-ocid="admin.logout.button"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" /> Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage EduBharat content</p>
        </div>
        <Button
          variant="outline"
          onClick={() => clear()}
          data-ocid="admin.logout.button"
        >
          Logout
        </Button>
      </div>

      <Tabs defaultValue="colleges">
        <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
          <TabsTrigger value="colleges" data-ocid="admin.colleges.tab">
            <Building2 className="h-4 w-4 mr-1.5" />
            Colleges
          </TabsTrigger>
          <TabsTrigger value="states" data-ocid="admin.states.tab">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            States
          </TabsTrigger>
          <TabsTrigger value="years" data-ocid="admin.years.tab">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            Years
          </TabsTrigger>
          <TabsTrigger value="subjects" data-ocid="admin.subjects.tab">
            <BookOpen className="h-4 w-4 mr-1.5" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="resources" data-ocid="admin.resources.tab">
            <Upload className="h-4 w-4 mr-1.5" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colleges">
          <Card>
            <CardHeader>
              <CardTitle>Add College</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="c-name">College Name</Label>
                <Input
                  id="c-name"
                  className="mt-1"
                  placeholder="e.g. IIT Bombay"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  data-ocid="admin.college_name.input"
                />
              </div>
              <div>
                <Label>State</Label>
                <Select value={collegeState} onValueChange={setCollegeState}>
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="admin.college_state.select"
                  >
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES_AND_UTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>College Type</Label>
                <Select value={collegeType} onValueChange={setCollegeType}>
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="admin.college_type.select"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLLEGE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="gap-2"
                disabled={
                  addCollege.isPending ||
                  !collegeName ||
                  !collegeState ||
                  !collegeType
                }
                onClick={async () => {
                  await addCollege.mutateAsync({
                    name: collegeName,
                    state: collegeState,
                    collegeType,
                  });
                  setCollegeName("");
                  setCollegeState("");
                  setCollegeType("");
                  toast.success("College added successfully");
                }}
                data-ocid="admin.college.submit_button"
              >
                {addCollege.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add College
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states">
          <Card>
            <CardHeader>
              <CardTitle>Add State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="s-name">State Name</Label>
                <Input
                  id="s-name"
                  className="mt-1"
                  placeholder="e.g. Goa"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  data-ocid="admin.state_name.input"
                />
              </div>
              <Button
                className="gap-2"
                disabled={addState.isPending || !newState}
                onClick={async () => {
                  await addState.mutateAsync(newState);
                  setNewState("");
                  toast.success("State added successfully");
                }}
                data-ocid="admin.state.submit_button"
              >
                {addState.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add State
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="years">
          <Card>
            <CardHeader>
              <CardTitle>Add Academic Year</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="y-val">Year</Label>
                <Input
                  id="y-val"
                  className="mt-1"
                  type="number"
                  placeholder="e.g. 2024"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  data-ocid="admin.year.input"
                />
              </div>
              <Button
                className="gap-2"
                disabled={addYear.isPending || !newYear}
                onClick={async () => {
                  await addYear.mutateAsync(BigInt(newYear));
                  setNewYear("");
                  toast.success("Year added successfully");
                }}
                data-ocid="admin.year.submit_button"
              >
                {addYear.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add Year
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Add Subject</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sub-name">Subject Name</Label>
                  <Input
                    id="sub-name"
                    className="mt-1"
                    placeholder="e.g. Data Structures"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    data-ocid="admin.subject_name.input"
                  />
                </div>
                <div>
                  <Label htmlFor="sub-code">Subject Code</Label>
                  <Input
                    id="sub-code"
                    className="mt-1"
                    placeholder="e.g. CS201"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    data-ocid="admin.subject_code.input"
                  />
                </div>
                <div>
                  <Label htmlFor="sub-year">Year</Label>
                  <Input
                    id="sub-year"
                    className="mt-1"
                    type="number"
                    placeholder="e.g. 2024"
                    value={subjectYear}
                    onChange={(e) => setSubjectYear(e.target.value)}
                    data-ocid="admin.subject_year.input"
                  />
                </div>
                <div>
                  <Label htmlFor="sub-sem">Semester</Label>
                  <Input
                    id="sub-sem"
                    className="mt-1"
                    type="number"
                    min="1"
                    max="8"
                    placeholder="1-8"
                    value={subjectSemester}
                    onChange={(e) => setSubjectSemester(e.target.value)}
                    data-ocid="admin.subject_semester.input"
                  />
                </div>
              </div>
              <Button
                className="gap-2"
                disabled={
                  addSubject.isPending ||
                  !subjectName ||
                  !subjectCode ||
                  !subjectYear ||
                  !subjectSemester
                }
                onClick={async () => {
                  await addSubject.mutateAsync({
                    name: subjectName,
                    code: subjectCode,
                    year: BigInt(subjectYear),
                    semester: BigInt(subjectSemester),
                  });
                  setSubjectName("");
                  setSubjectCode("");
                  setSubjectYear("");
                  setSubjectSemester("");
                  toast.success("Subject added successfully");
                }}
                data-ocid="admin.subject.submit_button"
              >
                {addSubject.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add Subject
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Upload Resource</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="res-title">Title</Label>
                <Input
                  id="res-title"
                  className="mt-1"
                  placeholder="e.g. Data Structures Notes 2024"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  data-ocid="admin.resource_title.input"
                />
              </div>
              <div>
                <Label htmlFor="res-subject">Subject ID</Label>
                <Input
                  id="res-subject"
                  className="mt-1"
                  placeholder="Subject ID"
                  value={resSubject}
                  onChange={(e) => setResSubject(e.target.value)}
                  data-ocid="admin.resource_subject.input"
                />
              </div>
              <div>
                <Label>Resource Type</Label>
                <Select value={resType} onValueChange={setResType}>
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="admin.resource_type.select"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="res-file">File (PDF)</Label>
                <Input
                  id="res-file"
                  type="file"
                  accept=".pdf"
                  className="mt-1"
                  onChange={(e) => setResFile(e.target.files?.[0] ?? null)}
                  data-ocid="admin.resource_file.upload_button"
                />
              </div>
              <Button
                className="gap-2"
                disabled={
                  uploadResource.isPending ||
                  !resTitle ||
                  !resSubject ||
                  !resType ||
                  !resFile
                }
                onClick={async () => {
                  if (!resFile) return;
                  const buffer = await resFile.arrayBuffer();
                  await uploadResource.mutateAsync({
                    title: resTitle,
                    subject: resSubject,
                    resourceType: resType,
                    file: new Uint8Array(buffer),
                  });
                  setResTitle("");
                  setResSubject("");
                  setResType("");
                  setResFile(null);
                  toast.success("Resource uploaded successfully");
                }}
                data-ocid="admin.resource.submit_button"
              >
                {uploadResource.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload Resource
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
