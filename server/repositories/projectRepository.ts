import { v4 as uuidv4 } from 'uuid'
import type { UpdateProjectInput } from '~~/shared/types/api.types'

const projects: Project[] = [mockProject]

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => a.name.localeCompare(b.name))
}

export function getProjectById(projectId: string): Project | undefined {
  return projects.find((p) => p.id === projectId)
}

export async function createProject(name: string): Promise<Project> {
  const now = new Date()
  const newProject: Project = {
    id: uuidv4(),
    name,
    createdAt: now,
    updatedAt: now,
  }
  projects.push(newProject)
  return newProject
}

export async function updateProject(
  projectId: string,
  data: UpdateProjectInput,
): Promise<Project | undefined> {
  const projectIndex = projects.findIndex((p) => p.id === projectId)
  if (projectIndex === -1) return undefined

  const project = projects[projectIndex]
  const updatedProject: Project = {
    id: project.id,
    name: data.name ?? project.name,
    createdAt: project.createdAt,
    updatedAt: new Date(),
  }
  projects[projectIndex] = updatedProject
  return updatedProject
}

export async function deleteProject(
  projectId: string,
): Promise<Project | undefined> {
  const projectIndex = projects.findIndex((p) => p.id === projectId)
  if (projectIndex === -1) return undefined

  const [deletedProject] = projects.splice(projectIndex, 1)
  return deletedProject
}
