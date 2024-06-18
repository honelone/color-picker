<template>
  <div
    class="gradient-content"
    ref="gradientRef"
    :style="{ backgroundColor: gradientBgColor }"
    @mousedown="onMouseDown"
  >
    <div class="sat-container"></div>
    <div class="val-container"></div>
    <div
      ref="gradientCursorRef"
      class="cursor-container"
      :style="{ backgroundColor: props.currentColor }"
    ></div>
  </div>
</template>

<script lang="tsx" setup>
  import { computed, onBeforeUnmount, ref } from 'vue';
  import { HUEtoRGB } from '@/utils';

  const props = defineProps<{
    width: number;
    currentColor: string;
    hue: number;
    sat: number;
    val: number;
  }>();
  const emits = defineEmits<{
    (event: 'update:sat', newVal: number): void;
    (event: 'update:val', newVal: number): void;
  }>();

  const gradientBgColor = computed(() => {
    const { r, g, b } = HUEtoRGB(props.hue);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  });

  const gradientWidth = computed(() => {
    return props.width;
  });
  const gradientLeft = ref(0);
  const gradientTop = ref(0);
  const gradientHeight = ref(0);

  const gradientRef = ref();
  const gradientCursorRef = ref();

  const onMouseDown = (e: MouseEvent) => {
    if (e.which !== 1) {
      return;
    }
    registerListeners();
    setSizePoses();

    if (e.target != gradientCursorRef.value) {
      handleUpdateCursor(e.offsetX, e.offsetY);

      e.stopPropagation();
      e.preventDefault();
    }
  };
  const onMouseup = () => {
    unregisterListeners();
  };
  const onMousemove = (e: MouseEvent) => {
    let posX = e.pageX - gradientLeft.value;
    let posY = e.pageY - gradientTop.value;
    posX = Math.min(gradientWidth.value, Math.max(0, posX));
    posY = Math.min(gradientHeight.value, Math.max(0, posY));

    handleUpdateCursor(posX, posY);
  };
  const handleUpdateCursor = (X: number, Y: number) => {
    gradientCursorRef.value.style.transform = `translate(${X}px, ${Y}px)`;
    const sat = X / gradientWidth.value;
    const value = 1 - Y / gradientHeight.value;
    emits('update:sat', sat);
    emits('update:val', value);
  };
  const setSizePoses = () => {
    const gradientBoundingRect = gradientRef.value.getBoundingClientRect();
    gradientLeft.value = gradientBoundingRect.left;
    gradientTop.value = gradientBoundingRect.top;
    gradientHeight.value = gradientBoundingRect.height;
  };
  const setCursor = () => {
    const gradientCursorX = gradientWidth.value * props.sat;
    const gradientCursorY = gradientHeight.value * (1 - props.val);
    gradientCursorRef.value.style.transform = `translate(${gradientCursorX}px, ${gradientCursorY}px)`;
  };

  defineExpose({
    setSizePoses,
    setCursor,
  });

  const registerListeners = () => {
    document.addEventListener('mouseup', onMouseup);
    document.addEventListener('mousemove', onMousemove);
  };
  const unregisterListeners = () => {
    document.removeEventListener('mouseup', onMouseup);
    document.removeEventListener('mousemove', onMousemove);
  };
  onBeforeUnmount(() => {
    unregisterListeners();
  });
</script>

<style scoped>
  .gradient-content {
    position: relative;
    width: 100%;
    height: 168px;
    cursor: pointer;
    overflow: hidden;
  }
  .sat-container,
  .val-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .sat-container {
    background-image: linear-gradient(90deg, #ffffff, rgb(204 154 129 / 0%));
  }

  .val-container {
    background-image: linear-gradient(0deg, #000000, rgb(204 154 129 / 0%));
  }

  .cursor-container {
    position: absolute;
    left: -8px;
    top: -8px;
    border: 2px solid #fff;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    background-color: #fff;
    /* pointer-events: none; */
    cursor: move;
    user-select: none;
  }
</style>
