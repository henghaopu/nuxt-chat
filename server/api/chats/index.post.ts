import { createChat } from '~~/server/repositories/chatRepository'
import type { CreateChatInput } from '~~/shared/types/api.types'

// post to the chats collection
export default defineEventHandler(async (event) => {
  const { title, projectId } = await readBody<CreateChatInput>(event)

  if (!title || !projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: title and projectId',
    })
  }

  return createChat({
    title,
    projectId,
  })
})
