<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import useScrollToBottom from '~/composables/useScrollToBottom'

type AppSidebarProps = {
  isOpen: boolean
}

defineProps<AppSidebarProps>()

const route = useRoute()
const { chats } = useChats()
const chatsWithoutProject = computed(() =>
  chats.value.filter((chat) => chat.projectId === undefined),
)
const last2DaysChatMenuItems = computed(() =>
  getChatMenuItemsByDaysAgo(chatsWithoutProject.value, 0, 1),
)
const last7DaysChatMenuItems = computed(() =>
  getChatMenuItemsByDaysAgo(chatsWithoutProject.value, 1, 7),
)
const last30DaysChatMenuItems = computed(() =>
  getChatMenuItemsByDaysAgo(chatsWithoutProject.value, 7, 30),
)
const olderThan30DaysChatMenuItems = computed(() =>
  getChatMenuItemsByDaysAgo(chatsWithoutProject.value, 30),
)
const chatSections = computed(() => {
  const allSections = [
    {
      title: 'Recent',
      items: last2DaysChatMenuItems.value,
      alwaysShow: true, // Always show Recent section
    },
    {
      title: 'Last 7 Days',
      items: last7DaysChatMenuItems.value,
      alwaysShow: false,
    },
    {
      title: 'Last 30 Days',
      items: last30DaysChatMenuItems.value,
      alwaysShow: false,
    },
    {
      title: 'Older',
      items: olderThan30DaysChatMenuItems.value,
      alwaysShow: false,
    },
  ]

  return allSections.filter(
    (section) => section.alwaysShow || section.items.length > 0,
  )
})

// Create template ref for the scrollable sidebar content
const sidebarScrollRef = useTemplateRef<HTMLDivElement>(refIds.sidebarScrollRef)

// Use scroll-to-bottom functionality for sidebar (no button, just auto-scroll)
const { scrollToBottom } = useScrollToBottom(sidebarScrollRef)

// Watch for new chats and auto-scroll to bottom to show the latest chat
watch(
  () => chats.value.length,
  async (newLength, oldLength) => {
    // Only auto-scroll when new chats are created (not on initial mount)
    if (oldLength !== undefined && newLength > oldLength) {
      await nextTick()
      // Always scroll to bottom to show the newly created chat
      scrollToBottom(true) // Use immediate scroll
    }
  },
)

function getChatMenuItemsByDaysAgo(
  chats: Chat[],
  minDaysAgo: number,
  maxDaysAgo?: number,
) {
  return chats
    .filter((chat) => isBetweenDaysAgo(chat.updatedAt, minDaysAgo, maxDaysAgo))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map(formatChatItem)
}

function formatChatItem(chat: Chat): NavigationMenuItem {
  return {
    label: chat.title || 'Untitled Chat',
    to: `/chats/${chat.id}`,
    active: route.params.id === chat.id,
  }
}
</script>

<template>
  <aside
    class="fixed top-16 left-0 bottom-0 w-64 transition-transform duration-300 z-40 bg-(--ui-bg-muted) border-r-(--ui-border) border-r"
    :class="{ '-translate-x-full': !isOpen }"
  >
    <div :ref="refIds.sidebarScrollRef" class="h-full overflow-y-auto p-4">
      <div v-for="section in chatSections" :key="section.title" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-sm font-semibold text-(--ui-text-muted)">
            {{ section.title }}
          </h2>
        </div>
        <UNavigationMenu orientation="vertical" :items="section.items" />
      </div>
    </div>
  </aside>
</template>
