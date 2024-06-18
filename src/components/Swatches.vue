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

<script lang="tsx" setup>
  import { computed } from 'vue';
  import { parseColor } from '@/utils';

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
    const defaultSwatches = [
      '#56CCF2',
      '#4BDDD4',
      '#61F0E7',
      '#49F397',
      '#96E24A',
      '#F1E257',
      '#FCB17A',
      '#EB5C5C',
      '#DD789C',
      '#F563DE',
      '#C18AF7',
      '#8177F5',
      '#9F71B5',
      '#A9A1C0',
      '#CEA3F9',
      '#4792E6',
    ];
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
