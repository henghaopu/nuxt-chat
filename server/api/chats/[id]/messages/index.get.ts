import { getAllMessagesInChat } from '~~/server/repositories/chatRepository'

export default defineEventHandler(async (event) => {
  const { id: chatId } = getRouterParams(event)

  const messages = getAllMessagesInChat(chatId)

  if (!messages) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Chat not found',
    })
  }

  return { messages }
})
