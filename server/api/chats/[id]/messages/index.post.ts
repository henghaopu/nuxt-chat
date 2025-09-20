import {
  createMessageInChat,
  getAllMessagesInChat,
} from '~~/server/repositories/chatRepository'
import {
  createOpenAIModel,
  generateAIResponseText,
} from '~~/server/services/aiService'

export default defineEventHandler(async (event) => {
  const { id: chatId } = getRouterParams(event)
  const body = await readBody(event)

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

  // Generate AI response if the message was from user
  if (body.role === 'user') {
    try {
      const history = getAllMessagesInChat(chatId)
      const model = createOpenAIModel()
      const reply = await generateAIResponseText(model, history || [])

      const aiMessage = await createMessageInChat(chatId, {
        role: 'assistant',
        content: reply as string,
      })

      // Return both messages
      return {
        userMessage,
        aiMessage,
      }
    } catch (error) {
      console.error('Failed to generate AI response:', error)
      // Return just the user message if AI generation fails
      return { userMessage }
    }
  }

  // For non-user messages, just return the created message
  return { message: userMessage }
})
