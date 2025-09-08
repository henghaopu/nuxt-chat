<script setup lang="ts">
import { refIds } from '~/utils/refId.constants'
import useFocus from '~/composables/useFocus'

type ChatInputProps = {
  isStreaming?: boolean
}

type ChatInputEmits = {
  'send-message': [message: string]
}

defineOptions({ name: 'ChatInput' })
const { isStreaming = false } = defineProps<ChatInputProps>()
const emit = defineEmits<ChatInputEmits>()
const newMessage = ref('')
const textareaRef = useTemplateRef<HTMLTextAreaElement>(refIds.promptTextarea)
const { focusIfNotMobile } = useFocus()

onMounted(() => {
  focusIfNotMobile(textareaRef)
})

watch(
  () => isStreaming, // Watch the isStreaming prop by providing a getter function that creates a reactive dependency
  // Callback when it changes
  async (value: boolean) => {
    // When AI is streaming a response, the textarea is disabled
    if (value) return
    // Once streaming finishes, we want the user to be able to type immediately
    // The nextTick() ensures any DOM updates (like re-enabling the textarea) are complete before focusing
    await nextTick() // Wait for DOM updates
    focusIfNotMobile(textareaRef) // Focus the textarea only on non-mobile
  },
)

function handleSendMessage() {
  if (!newMessage.value.trim()) return
  // Emit the new message to the parent component
  emit('send-message', newMessage.value.trim())
  newMessage.value = ''
  // nextTick() is a Vue utility function that waits for the next DOM update cycle to complete.
  nextTick(() => {
    adjustTextareaHeight()
    focusIfNotMobile(textareaRef) // Focus only on non-mobile devices
  })
}

function adjustTextareaHeight() {
  if (!textareaRef.value) return
  // shrink textarea to fit its content naturally
  textareaRef.value.style.height = 'auto'
  // scrollHeight is a read-only DOM property that returns the total height of an element's content, including content that's not visible due to overflow.
  textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
}
</script>

<template>
  <form
    class="relative border border-solid border-[var(--ui-border-accented)] rounded-4xl py-4 pr-8 pl-5 flex bg-[var(--ui-bg)] hover:shadow-md dark:shadow-lg dark:shadow-white/20"
    @submit.prevent="handleSendMessage"
  >
    <textarea
      :ref="refIds.promptTextarea"
      v-model="newMessage"
      rows="1"
      class="resize-none w-full mr-6 outline-none"
      :disabled="isStreaming"
      @input="adjustTextareaHeight"
      @keydown.enter.prevent="handleSendMessage"
    />
    <UButton
      type="submit"
      icon="i-heroicons-paper-airplane"
      class="absolute right-3 bottom-3 rounded-full"
      :disabled="!newMessage || isStreaming"
    />
  </form>
</template>
