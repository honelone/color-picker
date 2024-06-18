<template>
  <div class="panel-content">
    <Gradient
      ref="gradientRef"
      :width="gradientWidth"
      :currentColor="currentColor"
      :hue="hue"
      v-model:sat="sat"
      v-model:val="val"
    />
    <div class="controls-container">
      <div class="slider-container" ref="sliderRef">
        <Hue ref="hueRef" :width="sliderWidth" v-model:hue="hue" />
        <Opacity
          v-if="props.showOpacity"
          ref="opacityRef"
          :width="sliderWidth"
          v-model:alpha="alpha"
          :hue="hue"
          :sat="sat"
          :val="val"
        />
      </div>
      <div class="square" @click="handleOpenEyeDrop">
        <span :style="{ backgroundColor: currentColor }"></span>
      </div>
    </div>
    <Input
      v-model:hue="hue"
      v-model:sat="sat"
      v-model:val="val"
      v-model:alpha="alpha"
      :showOpacity="props.showOpacity"
    />
    <Swatches
      v-bind="$attrs"
      :currentColor="currentColor"
      :showOpacity="showOpacity"
      @select="handleSelectSwatch"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, onMounted, ref, watch } from 'vue';
  import Gradient from './Gradient.vue';
  import Hue from './Hue.vue';
  import Opacity from './Opacity.vue';
  import Input from './Input.vue';
  import Swatches from './Swatches.vue';
  import { HSVtoRGB, HEXtoRGB, parseColor, RGBtoHSV, RGBtoHEX, componentToHex } from '@/utils';

  const props = withDefaults(
    defineProps<{
      value: string;
      width?: number;
      showOpacity?: boolean;
    }>(),
    {
      value: '',
      width: 240,
      showOpacity: true,
    },
  );
  const emits = defineEmits<{
    (event: 'update:value', params: any): void;
    (event: 'change', params: any): void;
  }>();

  const gradientWidth = computed(() => {
    return props.width;
  });

  /** Slider */
  const sliderRef = ref();
  const sliderWidth = computed(() => {
    return sliderRef.value?.offsetWidth ?? 0;
  });

  const hue = ref(0);
  const sat = ref(0);
  const val = ref(0);
  const alpha = ref(1);
  const currentColor = computed(() => {
    const { r, g, b } = HSVtoRGB({ h: hue.value, s: sat.value, v: val.value });
    const hex = RGBtoHEX({ r, g, b });

    if (props.showOpacity) {
      const hexAlpha = componentToHex(Math.round(alpha.value * 255));
      return hex + hexAlpha;
    } else {
      return hex;
    }
  });

  watch(currentColor, () => {
    nextTick(() => {
      emits('update:value', currentColor.value);
      emits('change', currentColor.value);
      setUI();
    });
  });

  onMounted(() => {
    nextTick(() => {
      init();
    });
  });
  const init = () => {
    if (props.value) {
      const { hex: newHex, a } = parseColor(props.value);
      const { r, g, b } = HEXtoRGB(newHex);
      const { h, s, v } = RGBtoHSV({ r, g, b });
      hue.value = h;
      sat.value = s;
      val.value = v;
      if (props.showOpacity) {
        alpha.value = a;
      }
    }
    nextTick(() => {
      setUI();
    });
  };

  /** Set UI */
  const gradientRef = ref();
  const hueRef = ref();
  const opacityRef = ref();
  const setUI = () => {
    setSizePoses();
    nextTick(() => {
      setCursors();
    });
  };
  const setSizePoses = () => {
    gradientRef.value?.setSizePoses();
    hueRef.value?.setSizePoses();
    opacityRef.value?.setSizePoses();
  };
  const setCursors = () => {
    gradientRef.value?.setCursor();
    hueRef.value?.setCursor();
    opacityRef.value?.setCursor();
  };

  /** Select Swatch */
  const handleSelectSwatch = (hex: string, a = 1) => {
    const { r, g, b } = HEXtoRGB(hex);
    const { h, s, v } = RGBtoHSV({ r, g, b });
    hue.value = h;
    sat.value = s;
    val.value = v;
    if (props.showOpacity) {
      alpha.value = a;
    }
  };

  /** Eye Dropper */
  const handleOpenEyeDrop = async () => {
    const eyeDropper = new (window as any).EyeDropper();
    const result = await eyeDropper.open({});
    const hex = result.sRGBHex;
    handleSelectSwatch(hex, 1);
  };
</script>

<style scoped>
  .panel-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 240px;
    background-color: #fff;
  }

  .panel-content .controls-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .panel-content .controls-container .slider-container {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .panel-content .controls-container .square {
    border-radius: 4px;
    overflow: hidden;
    width: 28px;
    height: 28px;
    box-shadow: inset 0 0 1px 0 rgba(0, 0, 0, 0.25);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0.06) 0 25%,
      transparent 0 50%,
      rgba(0, 0, 0, 0.06) 0 75%,
      transparent 0
    );
    background-size: 50% 50%;
  }

  .panel-content .controls-container .square span {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
