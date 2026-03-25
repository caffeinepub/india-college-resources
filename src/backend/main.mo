import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import Order "mo:core/Order";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User profile type
  public type UserProfile = {
    name : Text;
    email : ?Text;
    institution : ?Text;
  };

  // User profiles storage
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Persistent state
  let states = List.empty<Text>();
  let colleges = Map.empty<Text, College>();
  let years = List.empty<Nat>();
  let subjects = Map.empty<Text, Subject>();
  let resources = Map.empty<Text, Resource>();

  // Data models
  public type College = {
    id : Text;
    name : Text;
    state : Text;
    collegeType : Text;
  };

  public type Subject = {
    id : Text;
    code : Text;
    year : Nat;
    semester : Nat;
    name : Text;
  };

  public type Resource = {
    id : Text;
    title : Text;
    subject : Text;
    resourceType : Text;
    uploadedBy : Text;
    file : ?Blob;
  };

  // Compare colleges by name
  module College {
    public func compare(college1 : College, college2 : College) : Order.Order {
      Text.compare(college1.name, college2.name);
    };
  };

  // Compare subjects by name
  module Subject {
    public func compare(subject1 : Subject, subject2 : Subject) : Order.Order {
      Text.compare(subject1.name, subject2.name);
    };
  };

  // Compare resources by title
  module Resource {
    public func compare(resource1 : Resource, resource2 : Resource) : Order.Order {
      Text.compare(resource1.title, resource2.title);
    };
  };

  // States and colleges - PUBLIC READ ACCESS
  public query func getAllStates() : async [Text] {
    states.toArray().sort();
  };

  public shared ({ caller }) func addState(state : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add states");
    };
    if (states.toArray().find(func(s) { s == state }) != null) {
      Runtime.trap("State already exists");
    };
    states.add(state);
  };

  public shared ({ caller }) func removeState(state : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove states");
    };
    let filtered = states.reverse().filter(func(s) { s != state });
    states.clear();
    states.addAll(filtered.reverse().values());
  };

  public query func getCollegesByState(state : Text) : async [College] {
    colleges.values().toArray().filter(func(c) { c.state == state }).sort();
  };

  public shared ({ caller }) func addCollege(name : Text, state : Text, collegeType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add colleges");
    };
    let id = name.concat(state);
    let college : College = { id; name; state; collegeType };
    colleges.add(id, college);
  };

  public shared ({ caller }) func removeCollege(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove colleges");
    };
    colleges.remove(id);
  };

  public query func searchColleges(searchText : Text) : async [College] {
    colleges.values().toArray().filter(func(c) { c.name.contains(#text(searchText)) }).sort();
  };

  // Years - PUBLIC READ ACCESS
  public query func getAllYears() : async [Nat] {
    years.toArray().sort();
  };

  public shared ({ caller }) func addYear(year : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add years");
    };
    years.add(year);
  };

  public shared ({ caller }) func removeYear(yearId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove years");
    };
    let filtered = years.reverse().filter(func(y) { y != yearId });
    years.clear();
    years.addAll(filtered.reverse().values());
  };

  // Subjects per year, college type, state - PUBLIC READ ACCESS
  public query func getSubjectsByYear(year : Nat) : async [Subject] {
    subjects.values().toArray().filter(func(s) { s.year == year }).sort();
  };

  public shared ({ caller }) func addSubject(name : Text, code : Text, year : Nat, semester : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add subjects");
    };
    let id = name.concat(code);
    let subject : Subject = { id; code; year; semester; name };
    subjects.add(id, subject);
  };

  public shared ({ caller }) func removeSubject(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove subjects");
    };
    subjects.remove(id);
  };

  public query func searchSubjects(searchText : Text) : async [Subject] {
    subjects.values().toArray().filter(func(s) { s.name.contains(#text(searchText)) }).sort();
  };

  // Resources per subject (notes, papers) - PUBLIC READ ACCESS
  public shared ({ caller }) func uploadResource(title : Text, subject : Text, resourceType : Text, file : Blob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload resources");
    };
    let id = title.concat(subject);
    let resource : Resource = {
      id;
      title;
      subject;
      resourceType;
      uploadedBy = caller.toText();
      file = ?file;
    };
    resources.add(id, resource);
  };

  public shared ({ caller }) func removeResource(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove resources");
    };
    resources.remove(id);
  };

  public query func getResourcesBySubject(subject : Text) : async [Resource] {
    resources.values().toArray().filter(func(r) { r.subject == subject }).sort();
  };

  public query func searchResources(searchText : Text) : async [Resource] {
    resources.values().toArray().filter(func(r) { r.title.contains(#text(searchText)) }).sort();
  };
};
