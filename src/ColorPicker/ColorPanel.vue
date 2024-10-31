<template>
  <div class="color-panel">
    <ColorPicker v-model:color="currentColor" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import ColorPicker from './index.vue';

  const props = defineProps<{ color: string }>();
  const emits = defineEmits<{ (event: 'update:color', value: string): void }>();

  const currentColor = computed({
    get() {
      return props.color;
    },
    set(value) {
      emits('update:color', value);
    },
  });
</script>

<style scoped>
  .color-panel {
    padding: 12px;
    background-color: #fff;
    border-radius: 8px;
  }
</style>
