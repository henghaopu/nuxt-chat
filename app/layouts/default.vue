<script setup lang="ts">
import { isTabletAndUp } from '~/utils/breakpoint.constants'

const { width } = useWindowSize()

// Mobile-first: start with sidebar closed to prevent hydration mismatch
// This ensures server and client render the same initial state
const isSidebarOpen = ref(false)

// Wait for hydration to complete before making responsive adjustments
onMounted(() => {
  // Set initial state based on current screen size
  isSidebarOpen.value = isTabletAndUp(width.value)

  // Watch for future changes
  watchEffect(() => {
    isSidebarOpen.value = isTabletAndUp(width.value)
  })
})
</script>

<template>
  <div class="h-dvh bg-[var(--ui-bg)]">
    <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    <AppSidebar :is-open="isSidebarOpen" />
    <main
      class="h-[calc(100dvh-4rem)] pt-16 transition-[margin-left] duration-300 ease-in-out overflow-y-auto"
      :class="{ 'ml-64': isSidebarOpen }"
    >
      <slot />
    </main>
  </div>
</template>
