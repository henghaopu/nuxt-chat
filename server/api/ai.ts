import { createOpenAIModel, generateAIResponse } from '../services/aiService'

// Nuxt (via Nitro/H3) does file‑based server routing and auto-registers the default export of each file as the HTTP request handler for that path.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { messages } = body
  const currentMessageCount = messages.length
  const openAIModel = createOpenAIModel()
  const response = await generateAIResponse(openAIModel, messages)

  return {
    id: currentMessageCount.toString(),
    content: response,
    role: 'assistant',
  }
})
