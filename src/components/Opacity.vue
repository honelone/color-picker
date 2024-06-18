<template>
  <div
    ref="alphaRef"
    class="alpha-slider"
    @mousedown="onMousedown"
    @touchstart.passive.capture.stop="onMousedown"
  >
    <div class="alpha-slider-content" :style="{ background: alphaBgColor }">
      <div ref="alphaCursorRef" class="slider-cursor" :style="{ background: cursorColor }"></div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
  import { computed, onBeforeUnmount, ref } from 'vue';
  import { HSVtoRGB } from '@/utils';

  const props = defineProps<{
    width: number;
    hue: number;
    sat: number;
    val: number;
    alpha: number;
  }>();
  const emits = defineEmits<{
    (event: 'update:alpha', newVal: number): void;
  }>();

  const alphaBgColor = computed(() => {
    const { r, g, b } = HSVtoRGB({ h: props.hue, s: props.sat, v: props.val });
    const opaque = `rgba(${r}, ${g}, ${b}, 0)`;
    const solid = `rgba(${r}, ${g}, ${b}, 1)`;
    return `linear-gradient(to right, ${opaque}, ${solid})`;
  });
  const cursorColor = computed(() => {
    const { r, g, b } = HSVtoRGB({ h: props.hue, s: props.sat, v: props.val });
    return `rgba(${r}, ${g}, ${b}, ${props.alpha})`;
  });

  const opacityWidth = computed(() => {
    return props.width;
  });
  const opacityLeft = ref(0);

  const alphaRef = ref();
  const alphaCursorRef = ref();

  const onMousedown = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      if (e.which !== 1) {
        return;
      }
      registerListeners();
      setSizePoses();

      if (e.target != alphaCursorRef.value) {
        handleUpdateCursor(e.offsetX);

        e.stopPropagation();
        e.preventDefault();
      }
    } else {
      // Touch
      registerListeners();
      setSizePoses();

      if (e.target != alphaCursorRef.value && e.target == alphaRef.value) {
        const offsetX = e.touches[0].pageX - (e.touches[0].target as HTMLElement).offsetLeft;
        handleUpdateCursor(offsetX);
      }
    }
  };
  const mouseup = () => {
    unregisterListeners();
  };
  const onMousemove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    let pos = 0;
    if (e instanceof MouseEvent) {
      pos = e.pageX - opacityLeft.value;
    } else {
      pos = e.touches[0].pageX - opacityLeft.value;
    }
    pos = Math.min(opacityWidth.value, Math.max(0, pos));
    handleUpdateCursor(pos);
  };
  const handleUpdateCursor = (X: number) => {
    alphaCursorRef.value.style.transform = `translate(${X}px, 0px)`;
    const alpha = ((X / opacityWidth.value) * 100) / 100;
    emits('update:alpha', alpha);
  };
  const setSizePoses = () => {
    const boundingRectOpacityLine = alphaRef.value.getBoundingClientRect();
    opacityLeft.value = boundingRectOpacityLine.left;
  };
  const setCursor = () => {
    const pos = props.alpha * opacityWidth.value ?? 0;
    alphaCursorRef.value.style.transform = `translate(${pos}px, 0px)`;
  };
  defineExpose({
    setSizePoses,
    setCursor,
  });

  const registerListeners = () => {
    document.addEventListener('mouseup', mouseup);
    document.addEventListener('mousemove', onMousemove);

    document.addEventListener('touchend', mouseup, { passive: false });
    document.addEventListener('touchmove', onMousemove, { passive: false });
  };
  const unregisterListeners = () => {
    document.removeEventListener('mouseup', mouseup);
    document.removeEventListener('mousemove', onMousemove);

    document.removeEventListener('touchend', mouseup);
    document.removeEventListener('touchmove', onMousemove);
  };
  onBeforeUnmount(() => {
    unregisterListeners();
  });
</script>

<style scoped>
  .alpha-slider {
    position: relative;
    border-radius: 4px;
    width: 100%;
    height: 8px;
    cursor: pointer;
    user-select: none;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0.06) 0 25%,
      transparent 0 50%,
      rgba(0, 0, 0, 0.06) 0 75%,
      transparent 0
    );
    background-size: 8px 8px;
    box-shadow: inset 0 0 1px 0 rgba(0, 0, 0, 0.25);
  }

  .alpha-slider-content {
    position: relative;
    border-radius: 4px;
    width: 100%;
    height: 100%;
  }

  .slider-cursor {
    position: absolute;
    top: -2px;
    left: -8px;
    border: 2px solid #fff;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    /* background-color: #fff; */
    /* pointer-events: none; */
    cursor: e-resize;
    user-select: none;
    box-shadow: inset 0 0 1px 0 rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.06);
  }
</style>
