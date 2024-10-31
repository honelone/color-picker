<template>
  <div class="preview-wrapper">
    <div class="preview-content" :style="{ 'background-color': color }">
      <div class="tips">{{ 'Color Picker' }}</div>
      <div class="color-panel">
        <ColorPicker v-model:color="color" />
      </div>
      <ColorPanel v-model:color="color" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ColorPicker, ColorPanel } from './ColorPicker';

  const color = ref('burlywood');
</script>

<style scoped>
  .preview-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: white;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0.06) 0 25%,
      transparent 0 50%,
      rgba(0, 0, 0, 0.06) 0 75%,
      transparent 0
    );
    background-size: 24px 24px;
  }
  .preview-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    width: 100%;
    height: 100%;
  }

  .preview-content .tips {
    font-size: 3rem;
    font-weight: bold;
    color: #fff;
    mix-blend-mode: difference;
  }
  .preview-content .color-panel {
    padding: 12px;
    background-color: #fff;
    border-radius: 8px;
  }
</style>
