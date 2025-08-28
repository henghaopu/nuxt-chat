import { refIds } from '~/constants/refId.constants'

// Pixel threshold to consider the user "near the bottom" of the chat history
const scrollBottomTolerancePx = 200

export default function useChatScroll() {
  // inputs
  const promptTextareaRef = useTemplateRef<HTMLTextAreaElement>(
    refIds.promptTextarea,
  )
  const chatHistoryDivRef = useTemplateRef<HTMLDivElement>(
    refIds.chatHistoryDiv,
  )

  // reactive states
  const isAtBottom = ref(true)
  const showScrollToBottomButton = computed(() => !isAtBottom.value)

  // Add scroll event listener
  onMounted(() => {
    if (!chatHistoryDivRef.value) return
    chatHistoryDivRef.value.addEventListener('scroll', updateBottomProximity)
    nextTick(() => {
      scrollToBottom(true) // Use immediate scroll on mount
      promptTextareaRef.value?.focus()
    })
  })

  function updateBottomProximity() {
    if (!chatHistoryDivRef.value) return
    const { scrollTop, clientHeight, scrollHeight } = chatHistoryDivRef.value
    const remainingScrollPx = scrollHeight - (scrollTop + clientHeight)
    // visual reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
    isAtBottom.value = remainingScrollPx <= scrollBottomTolerancePx
  }

  // Smooth scroll to bottom
  function scrollToBottom(immediate = false) {
    if (!chatHistoryDivRef.value) return

    const targetScrollTop =
      chatHistoryDivRef.value.scrollHeight -
      chatHistoryDivRef.value.clientHeight

    if (immediate) {
      chatHistoryDivRef.value.scrollTop = targetScrollTop
      return
    }

    const startScrollTop = chatHistoryDivRef.value.scrollTop
    const distance = targetScrollTop - startScrollTop
    const duration = 300

    const startTime = performance.now()
    function step(currentTime: number): void {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

      if (chatHistoryDivRef.value) {
        chatHistoryDivRef.value.scrollTop =
          startScrollTop + distance * easeInOutCubic

        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
    }

    requestAnimationFrame(step)
  }

  return {
    showScrollToBottomButton,
    scrollToBottom,
  }
}
