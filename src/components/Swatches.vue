<template>
  <div v-if="!hideSwatches" class="swatch-content">
    <div
      v-for="swatch in swatchesLazy"
      :key="swatch"
      class="swatch-item"
      :class="{ 'has-border': props.currentColor === swatch }"
      :style="{ backgroundColor: swatch }"
      @click="onSelectSwatch(swatch)"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { parseColor } from '@/utils';
  import { colorKeywords } from '@/data';

  const props = withDefaults(
    defineProps<{
      swatches?: string[];
      hideSwatches?: boolean;
      showOpacity?: boolean;
      currentColor: string;
    }>(),
    {
      hideSwatches: false,
    },
  );
  const emits = defineEmits<{
    (event: 'select', hex: string, alpha?: number): void;
  }>();

  const swatchesLazy = computed(() => {
    const defaultSwatches = getRandomValues(16);
    if (props.showOpacity) {
      return props.swatches ?? defaultSwatches.map((item) => item + 'FF');
    } else {
      return props.swatches ?? defaultSwatches;
    }
  });

  const onSelectSwatch = (swatchHex: string) => {
    const { hex, a } = parseColor(swatchHex);
    if (props.showOpacity) {
      emits('select', hex, a);
    } else {
      emits('select', hex);
    }
  };

  const getRandomValues = (count: number) => {
    const shuffled = Object.values(colorKeywords).sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
</script>

<style scoped>
  .swatch-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, 20px);
    justify-content: space-between;
    gap: 8px;
  }

  .swatch-item {
    position: relative;
    border-radius: 2px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .swatch-item.has-border {
    box-shadow: inset 0 0 0 1px skyblue;
    border-radius: 50%;
  }
</style>
