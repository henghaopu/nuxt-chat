import { getAllChats } from '~~/server/repositories/chatRepository'

// get from the chats collection
export default defineEventHandler(async (_event) => {
  return getAllChats()
})
