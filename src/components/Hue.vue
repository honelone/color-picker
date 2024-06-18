<template>
  <div
    ref="hueRef"
    class="hue-slider"
    @mousedown="onMousedown"
    @touchstart.passive.capture.stop="onMousedown"
  >
    <div ref="hueCursorRef" class="slider-cursor" :style="{ backgroundColor: cursorColor }"></div>
  </div>
</template>

<script lang="tsx" setup>
  import { computed, onBeforeUnmount, ref } from 'vue';
  import { HUEtoRGB } from '@/utils';

  const props = defineProps<{ width: number; hue: number }>();
  const emits = defineEmits<{
    (event: 'update:hue', newVal: number): void;
  }>();

  const cursorColor = computed(() => {
    const { r, g, b } = HUEtoRGB(props.hue);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  });

  const hueWidth = computed(() => {
    return props.width;
  });
  const hueLeft = ref(0);

  const hueRef = ref();
  const hueCursorRef = ref();

  const onMousedown = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      if (e.which !== 1) {
        return;
      }
      registerListeners();
      setSizePoses();

      if (e.target != hueCursorRef.value) {
        handleUpdateCursor(e.offsetX);

        e.stopPropagation();
        e.preventDefault();
      }
    } else {
      // Touch
      registerListeners();
      setSizePoses();

      if (e.target != hueCursorRef.value && e.target == hueRef.value) {
        const offsetX = e.touches[0].pageX - (e.touches[0].target as HTMLElement).offsetLeft;
        handleUpdateCursor(offsetX);
      }
    }
  };
  const unRegister = () => {
    unregisterListeners();
  };
  const onMousemove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    let pos = 0;
    if (e instanceof MouseEvent) {
      pos = e.pageX - hueLeft.value;
    } else {
      pos = e.touches[0].pageX - hueLeft.value;
    }
    pos = Math.min(hueWidth.value, Math.max(0, pos));
    handleUpdateCursor(pos);
  };
  const handleUpdateCursor = (X: number) => {
    hueCursorRef.value.style.transform = `translate(${X}px, 0px)`;
    const hue = Math.round((X / hueWidth.value) * 360 * 100) / 100;
    emits('update:hue', hue);
  };
  const setSizePoses = () => {
    const hueBoundingRect = hueRef.value.getBoundingClientRect();
    hueLeft.value = hueBoundingRect.left;
  };
  const setCursor = () => {
    const pos = (props.hue * hueWidth.value) / 360;
    hueCursorRef.value.style.transform = `translate(${pos}px, 0px)`;
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
  .hue-slider {
    position: relative;
    border-radius: 4px;
    width: 100%;
    height: 8px;
    cursor: pointer;
    user-select: none;
    background-image: linear-gradient(
      90deg,
      red 0,
      #ffff00 17%,
      #00ff00 33%,
      #00ffff 50%,
      #0000ff 67%,
      #ff00ff 83%,
      red
    );
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
