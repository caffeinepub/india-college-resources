# India College Resources

## Current State
New project with empty backend and no frontend.

## Requested Changes (Diff)

### Add
- State-wise listing of all Indian colleges (all types: engineering, medical, arts, science, law, management, etc.)
- College detail page showing years available
- Year detail showing subjects
- Subject detail with list of notes and previous year papers
- Upload functionality for notes/papers (PDF/documents)
- Download functionality for uploaded files
- Admin authorization to upload content
- Public read access (no login needed to browse/download)
- Search functionality across states/colleges/subjects

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: States, Colleges (with type), Years, Subjects, Resources (notes/papers) data models
2. Backend: CRUD for admin, read-only public APIs
3. Backend: File storage via blob-storage component
4. Backend: Authorization for admin uploads
5. Frontend: Home page with state grid
6. Frontend: State page listing colleges filtered by type
7. Frontend: College page listing years
8. Frontend: Year page listing subjects
9. Frontend: Subject page listing notes and papers with download
10. Frontend: Admin upload interface
11. Frontend: Search/filter across all levels
