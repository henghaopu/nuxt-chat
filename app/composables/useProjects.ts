export default function useProjects() {
  const projects = useState<Project[]>('projects', () => [mockProject])

  const createProject = async () => {
    const currentProjectCount = projects.value.length
    const newProjectIndex = currentProjectCount + 1
    const newProject = {
      id: newProjectIndex.toString(),
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
