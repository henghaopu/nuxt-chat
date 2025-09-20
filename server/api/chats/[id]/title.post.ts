import {
  getAllMessagesInChat,
  updateChat,
} from '~~/server/repositories/chatRepository'
import {
  createOpenAIModel,
  generateTitleFromMessages,
} from '~~/server/services/aiService'

export default defineEventHandler(async (event) => {
  const { id: chatId } = getRouterParams(event)
  const messages = getAllMessagesInChat(chatId)

  const model = createOpenAIModel()
  const title = await generateTitleFromMessages(model, messages || [])

  return updateChat(chatId, { title })
})
