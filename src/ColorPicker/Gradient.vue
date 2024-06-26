<template>
  <div
    class="gradient-content"
    ref="gradientRef"
    :style="{ backgroundColor: gradientBgColor }"
    @mousedown="onMousedown"
    @touchstart.passive.capture.stop="onMousedown"
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

<script lang="ts" setup>
  import { computed, onBeforeUnmount, ref } from 'vue';
  import { HUEtoRGB } from './utils';

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

  const onMousedown = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      // Mouse
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
    } else {
      // Touch
      registerListeners();
      setSizePoses();

      if (e.target != gradientCursorRef.value && e.target == gradientRef.value) {
        const offsetX = e.touches[0].pageX - (e.touches[0].target as HTMLElement).offsetLeft;
        const offsetY = e.touches[0].pageY - (e.touches[0].target as HTMLElement).offsetTop;
        handleUpdateCursor(offsetX, offsetY);
      }
    }
  };
  const unRegister = () => {
    unregisterListeners();
  };
  const onMousemove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    let posX = 0;
    let posY = 0;
    if (e instanceof MouseEvent) {
      posX = e.pageX - gradientLeft.value;
      posY = e.pageY - gradientTop.value;
    } else {
      posX = e.targetTouches[0].pageX - gradientLeft.value;
      posY = e.targetTouches[0].pageY - gradientTop.value;
    }

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
    document.addEventListener('mouseup', unRegister);
    document.addEventListener('mousemove', onMousemove);

    document.addEventListener('touchend', unRegister, { passive: false });
    document.addEventListener('touchmove', onMousemove, { passive: false });
  };
  const unregisterListeners = () => {
    document.removeEventListener('mouseup', unRegister);
    document.removeEventListener('mousemove', onMousemove);

    document.removeEventListener('touchend', unRegister);
    document.removeEventListener('touchmove', onMousemove);
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
    user-select: none;
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
    background-image: linear-gradient(90deg, #ffffff, transparent);
  }

  .val-container {
    background-image: linear-gradient(0deg, #000000, transparent);
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
    cursor: move;
    user-select: none;
  }
</style>
