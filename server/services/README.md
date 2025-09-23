# Service Layer Guidelines

This directory contains service implementations following Domain-Driven Design (DDD) and Clean Architecture principles.

## Service Layer Philosophy

> **"Services contain the business logic that doesn't naturally belong to any single entity"**

**Mental Test**: If the logic involves business rules, workflows, coordination between multiple entities, or external integrations, it belongs in a service layer.

## Types of Services

In this project, all services are organized in a single `services/` folder. Services can be categorized by their primary purpose:

### 1. Domain Services

Business logic that doesn't naturally fit within a single entity but is core to the domain.

- Example: `aiService.ts` - AI/ML business logic and integrations

### 2. Application Services

Orchestrate workflows, coordinate between multiple domain services and repositories.

- Example: `chatWorkflowService.ts` - Complex chat creation and management flows

### 3. Infrastructure Services

Handle external integrations, third-party APIs, and technical concerns.

- Example: `notificationService.ts` - Email, SMS, push notifications

## ✅ Service Responsibilities

### 1. Business Logic & Domain Rules

```typescript
// ✅ Complex business calculations
export async function calculateProjectROI(
  projectId: string,
  timeframe: number,
): Promise<ROIResult> {
  const project = await getProjectById(projectId)
  const expenses = await calculateProjectExpenses(project, timeframe)
  const revenue = await calculateProjectRevenue(project, timeframe)
  const taxRate = await getTaxRateForRegion(project.region)

  return {
    roi: ((revenue - expenses) / expenses) * 100,
    netProfit: (revenue - expenses) * (1 - taxRate),
    breakEvenPoint: calculateBreakEvenPoint(expenses, revenue),
  }
}

// ✅ Business rule validation
export function validateProjectEligibility(project: Project): ValidationResult {
  const errors: string[] = []

  if (project.budget < MINIMUM_PROJECT_BUDGET) {
    errors.push('Project budget below minimum threshold')
  }

  if (project.team.members.length < MINIMUM_TEAM_SIZE) {
    errors.push('Insufficient team members assigned')
  }

  if (!hasRequiredSkills(project.team, project.requiredSkills)) {
    errors.push('Team missing required skills')
  }

  return { isValid: errors.length === 0, errors }
}
```

### 2. Workflow Orchestration

```typescript
// ✅ Multi-step business processes
export async function promoteProjectToProduction(
  projectId: string,
): Promise<void> {
  const project = await getProjectById(projectId)

  // Step 1: Validate readiness
  const validation = validateProjectReadiness(project)
  if (!validation.isValid) {
    throw new BusinessError(
      'Project not ready for production',
      validation.errors,
    )
  }

  // Step 2: Update project status
  await updateProject(projectId, { status: 'production' })

  // Step 3: Configure production environment
  await configureProductionEnvironment(project)

  // Step 4: Notify stakeholders
  await notifyStakeholders(project, 'PROMOTED_TO_PRODUCTION')

  // Step 5: Create deployment ticket
  await createDeploymentTicket(project)

  // Step 6: Update team permissions
  await updateTeamPermissions(project.team, 'production')
}

// ✅ Complex workflow coordination
export async function completeProject(
  projectId: string,
  completionData: ProjectCompletionData,
): Promise<ProjectCompletionResult> {
  return await withTransaction(async (tx) => {
    // Coordinate multiple operations atomically
    const project = await getProjectById(projectId, tx)
    const finalReport = await generateProjectReport(project, completionData)
    const invoices = await generateFinalInvoices(project)

    await updateProject(
      projectId,
      {
        status: 'completed',
        completedAt: new Date(),
        finalReport: finalReport.id,
      },
      tx,
    )

    await archiveProjectResources(project, tx)
    await redistributeTeamMembers(project.team, tx)

    return {
      project,
      finalReport,
      invoices,
      archivedResources: await getArchivedResources(projectId),
    }
  })
}
```

### 3. Cross-Entity Operations

```typescript
// ✅ Operations spanning multiple aggregates
export async function reassignProjectToNewTeam(
  projectId: string,
  newTeamId: string,
): Promise<ReassignmentResult> {
  const project = await getProjectById(projectId)
  const oldTeam = await getTeamById(project.teamId)
  const newTeam = await getTeamById(newTeamId)

  // Validate team capacity and skills
  await validateTeamCanHandleProject(newTeam, project)

  // Remove permissions from old team
  await removeProjectPermissions(oldTeam.members, project)

  // Add permissions to new team
  await addProjectPermissions(newTeam.members, project)

  // Update project assignment
  await updateProject(projectId, { teamId: newTeamId })

  // Notify both teams
  await Promise.all([
    notifyTeam(oldTeam, 'PROJECT_REASSIGNED_FROM', { project }),
    notifyTeam(newTeam, 'PROJECT_ASSIGNED_TO', { project }),
  ])

  return {
    project: await getProjectById(projectId),
    oldTeam,
    newTeam,
    reassignedAt: new Date(),
  }
}
```

### 4. External System Integration

```typescript
// ✅ Third-party API integration
export async function generateAIResponseText(
  model: LanguageModel,
  messages: ChatMessage[],
): Promise<string> {
  // Empty messages array is likely a bug in the calling code
  if (messages.length === 0) {
    throw new BusinessError('Cannot generate AI response: no messages provided')
  }

  try {
    const response = await generateText({ model, messages })
    return response.text.trim()
  } catch (error) {
    // Handle external API errors
    if (error.code === 'RATE_LIMITED') {
      throw new BusinessError('AI service temporarily unavailable')
    }
    throw error
  }
}

// ✅ External service wrapper with business logic
export async function generateTitleFromMessages(
  model: LanguageModel,
  messages: ChatMessage[],
): Promise<string> {
  // Business rule: Need at least one message to generate title
  if (messages.length === 0) {
    return 'New Chat'
  }

  // Use a system prompt to guide the model to generate a concise title
  const systemPrompt =
    'Generate a concise title for the following conversation in three or less short words.'
  const promptMessages: ModelMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
  ]

  const response = await generateText({ model, messages: promptMessages })
  return response.text.trim()
}
```

### 5. Complex Queries & Aggregations

```typescript
// ✅ Business intelligence queries
export async function getProjectAnalytics(
  dateRange: DateRange,
  filters: ProjectFilters,
): Promise<ProjectAnalytics> {
  const projects = await getProjectsInRange(dateRange, filters)

  return {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === 'active').length,
    completedProjects: projects.filter((p) => p.status === 'completed').length,
    averageProjectDuration: calculateAverageProjectDuration(projects),
    totalRevenue: projects.reduce((sum, p) => sum + p.revenue, 0),
    profitMargin: calculateOverallProfitMargin(projects),
    topPerformingTeams: getTopPerformingTeams(projects, 5),
    riskAnalysis: analyzeProjectRisks(projects),
  }
}

// ✅ Complex business queries
export async function getHighRiskProjects(): Promise<Project[]> {
  const projects = await getAllActiveProjects()

  return projects.filter((project) => {
    const daysOverdue = getDaysOverdue(project.deadline)
    const budgetOverrun = getBudgetOverrunPercentage(project)
    const teamTurnover = getTeamTurnoverRate(project.team, 90) // last 90 days

    // Business rules for "high risk"
    return daysOverdue > 7 || budgetOverrun > 0.15 || teamTurnover > 0.25
  })
}
```

## ❌ NOT Service Responsibilities

### 1. Simple CRUD Operations

```typescript
// ❌ Belongs in repository
export async function getProjectById(id: string): Promise<Project | undefined> {
  return projectRepository.getProjectById(id)
}

// ❌ Simple data access
export async function getAllProjects(): Promise<Project[]> {
  return projectRepository.getAllProjects()
}
```

### 2. Pure Data Transformations

```typescript
// ❌ Belongs in utility functions or mappers
export function formatProjectForDisplay(project: Project): DisplayProject {
  return {
    id: project.id,
    title: project.name.toUpperCase(),
    formattedBudget: formatCurrency(project.budget),
    daysRemaining: calculateDaysUntil(project.deadline),
  }
}
```

### 3. Framework-Specific Logic

```typescript
// ❌ Belongs in API layer or controllers
export function validateHttpRequest(request: Request): ValidationResult {
  // HTTP validation logic
}

export function serializeProjectToJSON(project: Project): string {
  return JSON.stringify(project)
}
```

## Service Types & Examples

### Domain Services

```typescript
// aiService.ts - AI/ML domain logic
export async function generateAIResponseText(...)
export async function generateTitleFromMessages(...)
export async function analyzeMessageSentiment(...)

// projectAnalysisService.ts - Project domain logic
export async function calculateProjectROI(...)
export async function analyzeProjectRisks(...)
export async function validateProjectRequirements(...)
```

### Application Services

```typescript
// projectWorkflowService.ts - Orchestrates project workflows
export async function createProjectWithTeam(...)
export async function promoteProjectToProduction(...)
export async function completeProject(...)

// chatManagementService.ts - Orchestrates chat operations
export async function createChatWithAIResponse(...)
export async function archiveChatConversation(...)
```

### Infrastructure Services

```typescript
// emailService.ts - External email integration
export async function sendProjectNotification(...)
export async function sendWeeklyReport(...)

// storageService.ts - File/document management
export async function uploadProjectDocument(...)
export async function generatePDFReport(...)
```

## Best Practices

### 1. Dependency Injection

```typescript
// ✅ Inject dependencies, don't import directly
export class ProjectWorkflowService {
  constructor(
    private projectRepository: ProjectRepository,
    private teamRepository: TeamRepository,
    private notificationService: NotificationService,
  ) {}

  async promoteProject(projectId: string): Promise<void> {
    // Use injected dependencies
  }
}
```

### 2. Error Handling

```typescript
// ✅ Use domain-specific errors
export async function validateProjectBudget(project: Project): Promise<void> {
  if (project.budget > MAX_BUDGET_LIMIT) {
    throw new BusinessError(
      'Project budget exceeds maximum allowed limit',
      'BUDGET_LIMIT_EXCEEDED',
      { limit: MAX_BUDGET_LIMIT, requested: project.budget },
    )
  }
}
```

### 3. Transaction Management

```typescript
// ✅ Handle transactions for complex operations
export async function transferProjectResources(
  fromProjectId: string,
  toProjectId: string,
  resources: ResourceTransfer[],
): Promise<void> {
  return await withTransaction(async (tx) => {
    await removeResourcesFromProject(fromProjectId, resources, tx)
    await addResourcesToProject(toProjectId, resources, tx)
    await logResourceTransfer(fromProjectId, toProjectId, resources, tx)
  })
}
```

### 4. Input Validation

```typescript
// ✅ Validate inputs at service boundaries
export async function createProject(data: CreateProjectData): Promise<Project> {
  // Validate input
  const validation = validateCreateProjectData(data)
  if (!validation.isValid) {
    throw new ValidationError('Invalid project data', validation.errors)
  }

  // Business logic
  const project = await projectRepository.createProject({
    ...data,
    status: 'planning', // Business rule: new projects start in planning
    budget: Math.max(data.budget, MINIMUM_BUDGET), // Business rule: enforce minimum
  })

  return project
}
```

## Architecture Integration

```
┌─────────────────────────┐
│     API Endpoints       │ ← Handle HTTP, validation, serialization
├─────────────────────────┤
│       Services          │ ← Business logic, workflows, external integrations
│    (YOU ARE HERE)       │   All types: Domain, Application, Infrastructure
├─────────────────────────┤
│     Repositories        │ ← Data access, CRUD, simple queries
├─────────────────────────┤
│    Data Storage         │ ← Database, files, external APIs
└─────────────────────────┘
```

## File Organization

- `aiService.ts` - AI/ML integration and business logic
- `projectWorkflowService.ts` - Project lifecycle workflows
- `notificationService.ts` - Communication and alerts
- `analyticsService.ts` - Business intelligence and reporting
- Each service should have a single responsibility
- Group related business logic together

## When to Create a New Service

Create a new service when you have:

- Complex business logic that doesn't belong to an entity
- Workflow that coordinates multiple repositories
- Integration with external systems
- Cross-cutting concerns (logging, caching, etc.)

Remember: **Services are where your business logic lives - keep repositories simple and let services handle the complexity!**
