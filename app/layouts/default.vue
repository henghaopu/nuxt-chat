<script setup lang="ts">
const isSidebarOpen = ref(true)
</script>

<template>
  <div class="h-[calc(100vh-4rem)] bg-[var(--ui-bg)]">
    <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    <AppSidebar :is-open="isSidebarOpen" />
    <main
      class="h-full mt-16 transition-[margin-left] duration-300 ease-in-out"
      :class="{ 'ml-64': isSidebarOpen }"
    >
      <slot />
    </main>
  </div>
</template>
