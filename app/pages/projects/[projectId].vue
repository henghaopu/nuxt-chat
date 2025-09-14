<script setup lang="ts">
const route = useRoute()
// Since this is a page component ([projectId].vue), when the route changes (from /projects/1 to /projects/2),
// the entire component re-renders, so the constant gets re-initialized anyway.
const projectId = route.params.projectId as string // No computed needed
const isOnChatPage = computed(() => !!route.params.id)
const { project, updateProject } = useProject(projectId)
const { createChatAndNavigate } = useChats()

if (!project.value) {
  await navigateTo('/', { replace: true })
}

const isEditing = ref(false)
const editedName = ref('')

function startEditing() {
  if (!project.value || isOnChatPage.value) return

  isEditing.value = true
  editedName.value = project.value.name || ''
}

function cancelEditing() {
  isEditing.value = false
  editedName.value = ''
}

function handleRename() {
  if (!project.value) return

  const newName = editedName.value.trim()
  if (newName && newName !== project.value.name) {
    updateProject({ name: newName })
  }
  isEditing.value = false
  editedName.value = ''
}

async function handleNewChat() {
  await createChatAndNavigate({ projectId })
}
</script>

<template>
  <div class="p-4 h-full">
    <div
      v-if="project"
      class="flex items-start justify-between mb-6 pb-4 border-b border-b-solid border-b-[var(--ui-border)]"
    >
      <div>
        <div class="title-container">
          <h1
            v-if="!isEditing"
            class="text-2xl font-bold flex items-center gap-2 group"
            :class="{ 'cursor-pointer': !isOnChatPage }"
            @click="startEditing"
          >
            {{ project.name }}
            <UIcon
              v-if="!isOnChatPage"
              name="i-heroicons-pencil"
              class="w-5 h-5 text-(--ui-text-muted) hover:text-(--ui-text) transition-colors opacity-0 group-hover:opacity-100"
            />
          </h1>
          <div v-else class="flex gap-1 items-center">
            <UInput
              v-model="editedName"
              size="lg"
              autofocus
              class="text-2xl font-normal py-1 pr-2 h-auto w-auto min-w-[200px]"
              @keyup.enter="handleRename"
              @keyup.esc="cancelEditing"
            />
            <div class="flex gap-1">
              <UButton
                color="neutral"
                variant="soft"
                icon="i-heroicons-x-mark"
                size="sm"
                @click="cancelEditing"
              />
              <UButton
                color="primary"
                variant="soft"
                icon="i-heroicons-check"
                size="sm"
                @click="handleRename"
              />
            </div>
          </div>
        </div>

        <NuxtLink
          v-if="isOnChatPage"
          :to="`/projects/${projectId}`"
          class="text-sm text-(--ui-text-muted) flex items-center mt-1"
        >
          <UIcon name="i-heroicons-arrow-left" class="mr-1" />
          Back to Project
        </NuxtLink>
      </div>
      <UButton color="primary" icon="i-heroicons-plus" @click="handleNewChat"
        >New Chat in Project</UButton
      >
    </div>
  </div>
</template>
