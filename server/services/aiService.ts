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

export async function generateAIResponse(
  model: LanguageModel,
  messages: ChatMessage[],
) {
  const response = await generateText({ model, messages })
  return response.text.trim()
}
