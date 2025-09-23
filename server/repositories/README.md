# Repository Layer Guidelines

This directory contains repository implementations following Domain-Driven Design (DDD) and Clean Architecture principles.

## Repository Pattern Philosophy

> **"A repository should feel like an in-memory collection of domain objects"**

**Mental Test**: If you can imagine doing the same operation on a simple array in memory, it's probably fine for a repository. If it requires business knowledge or complex logic, it belongs in a service layer.

## ✅ Repository Responsibilities

### 1. Data Persistence Operations (CRUD)

```typescript
// ✅ These belong in repository
export function getProjectById(id: string): Project | undefined
export function getAllProjects(): Project[]
export function createProject(data: ProjectData): Project
export function updateProject(id: string, data: Partial<Project>): Project
export function deleteProject(id: string): boolean
```

### 2. Basic Query Operations

```typescript
// ✅ Simple filtering is okay
export function getProjectsByUserId(userId: string): Project[]
export function getActiveProjects(): Project[]
export function findProjectsByName(name: string): Project[]
```

### 3. Simple Array-like Operations

```typescript
// ✅ Just like array.find()
export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

// ✅ Just like array.filter()
export function getActiveProjects(): Project[] {
  return projects.filter((p) => p.status === 'active')
}

// ✅ Just like array.sort()
export function getProjectsSortedByName(): Project[] {
  return [...projects].sort((a, b) => a.name.localeCompare(b.name))
}

// ✅ Just like array.slice()
export function getProjectsPaginated(page: number, limit: number): Project[] {
  return projects.slice(page * limit, (page + 1) * limit)
}
```

### 4. Entity Lifecycle Management

```typescript
// ✅ ID generation, timestamps, validation of basic constraints
export function createProject(data: CreateProjectData): Project {
  const now = new Date()
  return {
    id: uuidv4(), // ✅ Repository handles ID generation
    ...data,
    createdAt: now, // ✅ Repository handles timestamps
    updatedAt: now,
  }
}
```

### 5. Data Access Abstraction

- Hide storage implementation details (database, file system, API calls)
- Provide a clean interface for domain objects
- Handle connection management, transactions

## ❌ NOT Repository Responsibilities

### 1. Business Logic

```typescript
// ❌ Business rules don't belong here
export function getHighPriorityProjects(): Project[] {
  return projects.filter(
    (p) => p.status === 'urgent' && p.budget > 10000 && p.deadline < tomorrow,
  )
}

// ❌ Complex business calculation
export function getProjectProfitability(id: string): number {
  const project = projects.find((p) => p.id === id)
  const revenue = calculateRevenue(project)
  const costs = calculateCosts(project)
  const taxRate = getTaxRateForRegion(project.region)
  return (revenue - costs) * (1 - taxRate)
}
```

### 2. Multi-step Business Processes

```typescript
// ❌ Business workflow with conditions
export function escalateOverdueProjects(): Project[] {
  const overdueProjects = projects.filter((p) => {
    const isOverdue = p.deadline < new Date()
    const hasNoExtension = !p.hasExtensionRequested
    const isHighPriority = p.priority === 'high'
    const hasActiveTeam = p.team.members.length > 0

    return isOverdue && hasNoExtension && isHighPriority && hasActiveTeam
  })

  // Business logic: different escalation based on how overdue
  return overdueProjects.map((project) => {
    if (isOverdue(project, 30)) {
      escalateToDirector(project)
    } else if (isOverdue(project, 14)) {
      escalateToManager(project)
    }
    return project
  })
}
```

### 3. Cross-Domain Operations

```typescript
// ❌ Involves multiple domains (Project + User + Team)
export function reassignProjectToNewTeam(
  projectId: string,
  teamId: string,
): void {
  const project = projects.find((p) => p.id === projectId)
  const oldTeam = getTeamByProject(project)
  const newTeam = getTeamById(teamId)

  removeUserPermissions(oldTeam.members, project)
  addUserPermissions(newTeam.members, project)
  updateProjectTeam(project, teamId)
  sendNotifications(oldTeam.members, newTeam.members, project)
}
```

### 4. Presentation/UI Logic

```typescript
// ❌ Formatting for UI doesn't belong here
export function getProjectsForDropdown(): { label: string; value: string }[] {
  return projects.map((p) => ({ label: p.name, value: p.id }))
}
```

## 🤔 Gray Areas (Context Dependent)

### Simple Sorting

```typescript
// 🤔 Debatable - could go either way
export function getProjectsSortedByName(): Project[] {
  return [...projects].sort((a, b) => a.name.localeCompare(b.name))
}
```

_Decision: Simple alphabetical sorting is like `array.sort()`, so it's acceptable for pragmatic reasons._

### Basic Pagination

```typescript
// 🤔 Often acceptable in repository
export function getProjects(page: number, limit: number): Project[] {
  return projects.slice(page * limit, (page + 1) * limit)
}
```

### Simple Aggregation

```typescript
// 🤔 Simple aggregation - could go either way
export function countActiveProjects(): number {
  return projects.filter((p) => p.status === 'active').length
}
```

## Best Practices

### 1. DDD Pattern Implementation

```typescript
// Repository handles ID generation and timestamps (DDD pattern)
export async function createMessageInChat(
  chatId: string,
  newMessage: Omit<ChatMessage, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ChatMessage | undefined>
```

### 2. Consistent Return Types

```typescript
// Use null for explicit API contracts (not undefined)
export interface PopulatedChat extends Chat {
  project: Project | null // ✅ Explicit nullability
}
```

### 3. Error Handling

```typescript
// Return undefined for "not found" cases
export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}
```

### 4. Immutable Operations

```typescript
// Always return new arrays/objects
export function getProjects(): Project[] {
  return [...projects] // ✅ Don't expose internal array directly
}
```

## Architecture Layers

```
┌─────────────────────────┐
│     API Endpoints       │ ← Handle HTTP, validation, serialization
├─────────────────────────┤
│   Application Services  │ ← Orchestrate workflows, business processes
├─────────────────────────┤
│    Domain Services      │ ← Business logic, domain rules
├─────────────────────────┤
│     Repositories        │ ← Data access, CRUD, simple queries (YOU ARE HERE)
├─────────────────────────┤
│    Data Storage         │ ← Database, files, external APIs
└─────────────────────────┘
```

## File Organization

- `chatRepository.ts` - Chat and message data access
- `projectRepository.ts` - Project data access
- Each repository should focus on a single aggregate root
- Keep repositories focused and cohesive

## When to Create a New Repository

Create a new repository when you have:

- A new aggregate root in your domain
- A clear boundary between different types of entities
- Different persistence requirements (different databases, APIs)

Remember: **Keep it simple, keep it focused, keep it like an in-memory collection!**
