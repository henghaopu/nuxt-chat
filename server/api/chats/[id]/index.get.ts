import { getChatById } from '~~/server/repositories/chatRepository'

type UserIdParams = { id: string }

export default defineEventHandler(async (event) => {
  const { id: chatId } = getRouterParams(event) as UserIdParams

  return getChatById(chatId)
})
