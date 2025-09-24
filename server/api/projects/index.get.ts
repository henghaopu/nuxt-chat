import { getAllProjects } from '~~/server/repositories/projectRepository'

export default defineEventHandler(async (_event) => {
  return getAllProjects()
})
