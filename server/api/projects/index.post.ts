import { createProject } from '~~/server/repositories/projectRepository'
import type { CreateProjectInput } from '~~/shared/types/api.types'

export default defineEventHandler(async (event) => {
  const { name } = await readBody<CreateProjectInput>(event)
  return createProject(name)
})
