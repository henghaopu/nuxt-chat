import { isMobile } from '~/utils/breakpoint.constants'

/**
 * Composable for managing focus behavior across different screen sizes
 */
export default function useFocus() {
  /**
   * Focus an element only if the screen is not a mobile device
   * This prevents virtual keyboard from popping up unexpectedly on phones
   */
  function focusIfNotMobile(elementRef: Ref<HTMLElement | null>) {
    const { width } = useWindowSize()
    if (!isMobile(width.value)) {
      elementRef.value?.focus()
    }
  }

  return {
    focusIfNotMobile,
  }
}
