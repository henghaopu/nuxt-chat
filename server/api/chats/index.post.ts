import { createChat } from '~~/server/repositories/chatRepository'

// post to the chats collection
export default defineEventHandler(async (event) => {
  const { title, projectId } = await readBody<{
    title: string
    projectId: string
  }>(event)

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
