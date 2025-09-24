<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import useScrollToBottom from '~/composables/useScrollToBottom'

type AppSidebarProps = {
  isOpen: boolean
}

defineProps<AppSidebarProps>()

const route = useRoute()
const { projects, createProject } = useProjects() // Ensure projects are loaded
const { chats, findChatsByProjectId, createChatAndNavigate } = useChats()
const chatsInCurrentProject = computed(() =>
  findChatsByProjectId(route.params.projectId as string),
)
const formattedProjectItems = computed(() => {
  if (!projects.value) return []

  // Sort projects by last activity (recent to past)
  const sortedProjects = [...projects.value].sort((a, b) => {
    return b.updatedAt.getTime() - a.updatedAt.getTime() // Descending order (recent to past)
  })

  return sortedProjects.map(formatProjectItem)
})
const chatsWithoutProject = computed(() =>
  chats.value.filter((chat) => chat.projectId === undefined),
)
const todayChatMenuItems = computed(() =>
  getChatMenuItemsByDaysAgo(chatsWithoutProject.value, 0, 0),
)
const lastWeekChatMenuItems = computed(() =>
  getChatMenuItemsByDaysAgo(chatsWithoutProject.value, 1, 7),
)
const lastMonthChatMenuItems = computed(() =>
  getChatMenuItemsByDaysAgo(chatsWithoutProject.value, 8, 30),
)
const olderThan30DaysChatMenuItems = computed(() =>
  getChatMenuItemsByDaysAgo(chatsWithoutProject.value, 31),
)
const chatSections = computed(() => {
  const allSections = [
    {
      title: 'Today',
      items: todayChatMenuItems.value,
      alwaysShow: true, // Always show Today section
    },
    {
      title: 'Last 7 Days',
      items: lastWeekChatMenuItems.value,
      alwaysShow: false,
    },
    {
      title: 'Last 30 Days',
      items: lastMonthChatMenuItems.value,
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

function isCurrentProject(projectId: string) {
  return route.params.projectId === projectId
}

function getChatMenuItemsByDaysAgo(
  chats: Chat[],
  minDaysAgo: number,
  maxDaysAgo?: number,
) {
  return chats
    .filter((chat) => isBetweenDaysAgo(chat.updatedAt, minDaysAgo, maxDaysAgo))
    .sort((a, b) => {
      const aDate =
        typeof a.updatedAt === 'string' ? new Date(a.updatedAt) : a.updatedAt
      const bDate =
        typeof b.updatedAt === 'string' ? new Date(b.updatedAt) : b.updatedAt
      return bDate.getTime() - aDate.getTime()
    })
    .map(formatChatItem)
}

function formatChatItem(chat: Chat): NavigationMenuItem {
  return {
    label: chat.title || 'Untitled Chat',
    to: `/chats/${chat.id}`,
    active: route.params.id === chat.id,
  }
}

function formatProjectChatItem(
  project: Project,
  chat: Chat,
): NavigationMenuItem {
  return {
    label: chat.title || 'Untitled Chat',
    to: `/projects/${project.id}/chats/${chat.id}`,
    active:
      route.params.projectId === project.id && route.params.id === chat.id,
  }
}

function formatProjectItem(project: Project): NavigationMenuItem {
  const isCurrent = isCurrentProject(project.id)

  const baseItem: NavigationMenuItem = {
    label: project.name || 'Untitled Project',
    to: `/projects/${project.id}`,
    active: isCurrent,
    defaultOpen: isCurrent,
  }

  if (isCurrent) {
    // If this is the current project, include its chats as children
    const projectChats = chatsInCurrentProject.value
      .filter((chat) => chat.projectId === project.id)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .map((chat) => formatProjectChatItem(project, chat))

    return {
      ...baseItem,
      children: projectChats,
    }
  }

  return baseItem
}

async function handleCreateProject() {
  const newProject = await createProject()
  await createChatAndNavigate({ projectId: newProject.id })
}
</script>

<template>
  <aside
    class="fixed top-16 left-0 bottom-0 w-64 transition-transform duration-300 z-40 bg-(--ui-bg-muted) border-r-(--ui-border) border-r overflow-y-auto"
    :class="{ '-translate-x-full': !isOpen }"
  >
    <div
      v-if="formattedProjectItems.length > 0"
      class="mb-4 p-4 border-b border-(--ui-border)"
    >
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-sm font-semibold text-(--ui-text-muted)">Projects</h2>
      </div>
      <UButton
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-heroicons-plus-small"
        class="mt-2 w-full"
        @click="handleCreateProject"
      >
        New Project
      </UButton>
      <!-- Use a key to force a re-render when the items change. There might be a timing issue with the accordion state management. -->
      <UNavigationMenu
        :key="`projects-${route.params.projectId}`"
        orientation="vertical"
        class="w-full mb-4"
        :items="formattedProjectItems"
      />
    </div>
    <div :ref="refIds.sidebarScrollRef" class="p-4">
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
