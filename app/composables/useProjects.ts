import { v4 as uuidv4 } from 'uuid'

export default function useProjects() {
  const projects = useState<Project[]>('projects', () => [mockProject])

  const createProject = async () => {
    const currentProjectCount = projects.value.length
    const newProjectIndex = currentProjectCount + 1
    const newProject = {
      id: uuidv4(),
      name: `Project ${newProjectIndex}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    projects.value.push(newProject)

    return newProject
  }

  return {
    projects,
    createProject,
  }
}
