import {
  getProjectById,
  updateProject,
} from '~~/server/repositories/projectRepository'
import type { UpdateProjectInput } from '~~/shared/types/api.types'

export default defineEventHandler(async (event) => {
  const { id: projectId } = getRouterParams(event)
  const project = await getProjectById(projectId)
  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  const body = await readBody<UpdateProjectInput>(event)

  // Validate that at least one field is provided
  if (!body.name && body.name !== '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one field must be provided for update',
    })
  }

  // Validate name if provided
  if (body.name !== undefined && body.name.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name cannot be empty',
    })
  }

  return updateProject(projectId, { name: body.name })
})
