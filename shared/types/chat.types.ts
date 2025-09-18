// General TypeScript Interface Ordering Rules:
// Type aliases and unions (primitives)
// Base interfaces (no dependencies on other interfaces)
// Dependent interfaces (reference other interfaces)
// Extended interfaces (inherit from others)
// Complex composite types (combine multiple interfaces)

// 1. Simple types first
export type Role = 'user' | 'assistant'

// 2. Base interfaces (no dependencies)
export interface Project {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// 3. Interfaces that depend on simple types
export interface ChatMessage {
  id: string
  content: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

// 4. Complex interfaces that depend on other interfaces
export interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
  projectId?: string // reference to Project by ID
  createdAt: Date
  updatedAt: Date
}

// 5. Extended/composite interfaces last
// Populated (已填入/載入的): include relational data
export interface PopulatedChat extends Chat {
  project?: Project
}
