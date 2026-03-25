import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface College {
    id: string;
    name: string;
    collegeType: string;
    state: string;
}
export interface Resource {
    id: string;
    title: string;
    subject: string;
    file?: Uint8Array;
    resourceType: string;
    uploadedBy: string;
}
export interface Subject {
    id: string;
    semester: bigint;
    code: string;
    name: string;
    year: bigint;
}
export interface UserProfile {
    institution?: string;
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCollege(name: string, state: string, collegeType: string): Promise<void>;
    addState(state: string): Promise<void>;
    addSubject(name: string, code: string, year: bigint, semester: bigint): Promise<void>;
    addYear(year: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllStates(): Promise<Array<string>>;
    getAllYears(): Promise<Array<bigint>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCollegesByState(state: string): Promise<Array<College>>;
    getResourcesBySubject(subject: string): Promise<Array<Resource>>;
    getSubjectsByYear(year: bigint): Promise<Array<Subject>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeCollege(id: string): Promise<void>;
    removeResource(id: string): Promise<void>;
    removeState(state: string): Promise<void>;
    removeSubject(id: string): Promise<void>;
    removeYear(yearId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchColleges(searchText: string): Promise<Array<College>>;
    searchResources(searchText: string): Promise<Array<Resource>>;
    searchSubjects(searchText: string): Promise<Array<Subject>>;
    uploadResource(title: string, subject: string, resourceType: string, file: Uint8Array): Promise<void>;
}
