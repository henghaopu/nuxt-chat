import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createOllama } from 'ollama-ai-provider'
import type { OpenAIChatModelId } from '@ai-sdk/openai/internal'
import type { LanguageModel } from 'ai'

// Extra wrapper could be used to
// - hide API key management from callers
// - add error handling, retry logic, or logging
export function createOpenAIModel(modelId: OpenAIChatModelId = 'gpt-4o-mini') {
  const { openaiApiKey } = useRuntimeConfig()
  const openai = createOpenAI({ apiKey: openaiApiKey })
  return openai(modelId)
}

export function createOllamaModel() {
  const ollama = createOllama()
  // hardcode the model because OllamaChatModelId is not exported by the package
  return ollama('llama3.2')
}

export async function generateAIResponseText(
  model: LanguageModel, // Inject model dependency
  messages: ChatMessage[],
) {
  // Empty messages array is likely a bug in the calling code
  if (messages.length === 0)
    return new Error('Cannot generate AI response: no messages provided')

  const response = await generateText({ model, messages })
  return response.text.trim()
}
