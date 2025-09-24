import { createMessageInChat } from '~~/server/repositories/chatRepository'
import type { CreateMessageInput } from '~~/shared/types/api.types'

export default defineEventHandler(async (event) => {
  const { id: chatId } = getRouterParams(event)
  const body = await readBody<CreateMessageInput>(event)

  // Validate required fields
  if (!body.role || !body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: role and content',
    })
  }

  // Create the user message
  const userMessage = await createMessageInChat(chatId, {
    role: body.role,
    content: body.content,
  })

  if (!userMessage) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Chat not found',
    })
  }

  return userMessage
})
