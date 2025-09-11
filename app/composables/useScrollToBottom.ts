// Pixel threshold to consider the user "near the bottom" of the chat history
const scrollBottomTolerancePx = 200

/**
 * Generic composable for managing scroll-to-bottom behavior in a scrollable container
 * Provides smooth scrolling, proximity detection, and auto-scroll functionality
 * @param scrollContainerRef - Reference to the scrollable container element
 * @param options - Configuration options
 */
export default function useScrollToBottom(
  scrollContainerRef: Ref<HTMLElement | null>,
  options: {
    tolerance?: number
    autoFocusRef?: Ref<HTMLElement | null>
  } = {},
) {
  const { tolerance = scrollBottomTolerancePx, autoFocusRef } = options

  // reactive states
  const isAtBottom = ref(true)
  const showScrollToBottomButton = computed(() => !isAtBottom.value)

  const { focusIfNotMobile } = useFocus()

  // Add scroll event listener
  onMounted(async () => {
    if (!scrollContainerRef.value) return

    scrollContainerRef.value.addEventListener('scroll', updateBottomProximity)

    await nextTick()
    // Use immediate scroll on mount
    scrollToBottom(true)

    // Auto-focus if element ref is provided
    if (autoFocusRef) {
      focusIfNotMobile(autoFocusRef)
    }
  })

  function updateBottomProximity() {
    if (!scrollContainerRef.value) return
    const { scrollTop, clientHeight, scrollHeight } = scrollContainerRef.value
    const remainingScrollPx = scrollHeight - (scrollTop + clientHeight)
    // visual reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
    isAtBottom.value = remainingScrollPx <= tolerance
  }

  // Smooth scroll to bottom
  function scrollToBottom(immediate = false) {
    if (!scrollContainerRef.value) return

    const targetScrollTop =
      scrollContainerRef.value.scrollHeight -
      scrollContainerRef.value.clientHeight

    if (immediate) {
      scrollContainerRef.value.scrollTop = targetScrollTop
      return
    }

    const startScrollTop = scrollContainerRef.value.scrollTop
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

      if (scrollContainerRef.value) {
        scrollContainerRef.value.scrollTop =
          startScrollTop + distance * easeInOutCubic

        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
    }

    requestAnimationFrame(step)
  }

  async function pinToBottom() {
    if (!scrollContainerRef.value) return

    // Store if user was at bottom before new content
    const wasAtBottom = isAtBottom.value

    // Wait for new content to be rendered
    await nextTick()

    // If user was at bottom, keep them there
    if (wasAtBottom) {
      scrollToBottom(true)
    }

    // Always update the proximity state after content changes
    updateBottomProximity()
  }

  // Cleanup
  onUnmounted(() => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.removeEventListener(
        'scroll',
        updateBottomProximity,
      )
    }
  })

  return {
    isAtBottom: readonly(isAtBottom),
    showScrollToBottomButton,
    scrollToBottom,
    pinToBottom,
    updateBottomProximity,
  }
}
