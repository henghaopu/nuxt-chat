import {
  createMessageInChat,
  getAllMessagesInChat,
} from '~~/server/repositories/chatRepository'
import {
  createOpenAIModel,
  generateAIResponseText,
} from '~~/server/services/aiService'

/**
 * RPC-style endpoint for generating AI responses
 *
 * This endpoint follows RPC (Remote Procedure Call) design patterns:
 * - Action-oriented URL: /api/chats/:id/messages/generate (verb-based)
 * - Function-like behavior: "generate a response" rather than "create a resource"
 * - Business logic operation rather than simple CRUD
 *
 * Alternative REST approach would be: POST /api/chats/:id/messages
 */
export default defineEventHandler(async (event) => {
  const { id: chatId } = getRouterParams(event)
  const history = getAllMessagesInChat(chatId)

  const openai = createOpenAIModel()
  const reply = await generateAIResponseText(openai, history || [])

  return createMessageInChat(chatId, {
    role: 'assistant',
    content: reply as string,
  })
})
