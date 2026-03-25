import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { College, Resource, Subject } from "../backend";
import { useActor } from "./useActor";

export function useAllStates() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["states"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCollegesByState(state: string) {
  const { actor, isFetching } = useActor();
  return useQuery<College[]>({
    queryKey: ["colleges", state],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCollegesByState(state);
    },
    enabled: !!actor && !isFetching && !!state,
  });
}

export function useAllYears() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["years"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllYears();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubjectsByYear(year: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Subject[]>({
    queryKey: ["subjects", year?.toString()],
    queryFn: async () => {
      if (!actor || year === null) return [];
      return actor.getSubjectsByYear(year);
    },
    enabled: !!actor && !isFetching && year !== null,
  });
}

export function useResourcesBySubject(subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Resource[]>({
    queryKey: ["resources", subject],
    queryFn: async () => {
      if (!actor || !subject) return [];
      return actor.getResourcesBySubject(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useSearchColleges(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<College[]>({
    queryKey: ["search-colleges", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchColleges(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useSearchSubjects(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Subject[]>({
    queryKey: ["search-subjects", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchSubjects(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useSearchResources(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Resource[]>({
    queryKey: ["search-resources", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchResources(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["is-admin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCollege() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      state,
      collegeType,
    }: { name: string; state: string; collegeType: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCollege(name, state, collegeType);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colleges"] });
    },
  });
}

export function useAddState() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (state: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.addState(state);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["states"] });
    },
  });
}

export function useAddYear() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (year: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.addYear(year);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["years"] });
    },
  });
}

export function useAddSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      code,
      year,
      semester,
    }: { name: string; code: string; year: bigint; semester: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addSubject(name, code, year, semester);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["subjects", vars.year.toString()] });
    },
  });
}

export function useUploadResource() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      subject,
      resourceType,
      file,
    }: {
      title: string;
      subject: string;
      resourceType: string;
      file: Uint8Array;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.uploadResource(title, subject, resourceType, file);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["resources", vars.subject] });
    },
  });
}

export function useRemoveCollege() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeCollege(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colleges"] });
    },
  });
}

export function useRemoveResource() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeResource(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}
