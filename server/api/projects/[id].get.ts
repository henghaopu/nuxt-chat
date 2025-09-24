import { getProjectById } from '~~/server/repositories/projectRepository'

export default defineEventHandler(async (event) => {
  const { id: projectId } = getRouterParams(event)
  return getProjectById(projectId)
})
