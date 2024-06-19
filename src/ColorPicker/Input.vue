<template>
  <div class="input-content">
    <select class="input-select" :value="colorType" @change="onChange">
      <option class="input-select-option" value="hex">HEX</option>
      <option class="input-select-option" value="rgb">RGB</option>
    </select>
    <div v-show="colorType === 'rgb'" class="input-rgb">
      <div class="input-rgb-item">
        <input v-model="currentColor.r" @input="inputUpdated('rgb')" @blur="onBlurRgb" />
      </div>
      <div class="input-rgb-item">
        <input v-model="currentColor.g" @input="inputUpdated('rgb')" @blur="onBlurRgb" />
      </div>
      <div class="input-rgb-item">
        <input v-model="currentColor.b" @input="inputUpdated('rgb')" @blur="onBlurRgb" />
      </div>
      <div v-if="props.showOpacity" class="input-rgb-item">
        <input
          class="alpha-input"
          v-model="currentColor.a"
          @input="inputUpdated('a')"
          @blur="onBlurA"
        />
      </div>
    </div>
    <div v-show="colorType === 'hex'" class="input-hex">
      <input v-model="currentColor.hex" @input="inputUpdated('hex')" @blur="onBlurHex" />
      <input
        v-if="props.showOpacity"
        class="alpha-input"
        v-model="currentColor.a"
        @input="inputUpdated('a')"
        @blur="onBlurA"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick, watch, reactive } from 'vue';
  import { HSVtoRGB, HEXtoRGB, parseColor, RGBtoHSV, RGBtoHEX } from './utils';

  const props = defineProps<{
    hue: number;
    sat: number;
    val: number;
    alpha: number;
    showOpacity: boolean;
  }>();
  const emits = defineEmits<{
    (event: 'update:hue', newVal: number): void;
    (event: 'update:sat', newVal: number): void;
    (event: 'update:val', newVal: number): void;
    (event: 'update:alpha', newValue: number): void;
  }>();

  /** Select */
  const colorType = ref('hex');
  const onChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    colorType.value = value;
  };

  const initColor = () => {
    const { r, g, b } = HSVtoRGB({ h: props.hue, s: props.sat, v: props.val });
    const hex = RGBtoHEX({ r, g, b });
    return {
      r,
      g,
      b,
      a: props.alpha,
      hex,
    };
  };
  const currentColor = reactive({
    r: 0,
    g: 0,
    b: 0,
    a: 1,
    hex: '#FFFE00FF',
  });

  watch(
    [() => props.hue, () => props.sat, () => props.val, () => props.alpha],
    () => {
      const { r, g, b, a, hex } = initColor();
      currentColor.r = r;
      currentColor.g = g;
      currentColor.b = b;
      currentColor.a = a;
      currentColor.hex = hex;
    },
    { immediate: true },
  );

  const validateRgb = () => {
    let r = Number(currentColor.r);
    r = isNaN(r) ? 0 : r > 255 ? 255 : r < 0 ? 0 : r;
    let g = Number(currentColor.g);
    g = isNaN(g) ? 0 : g > 255 ? 255 : g < 0 ? 0 : g;
    let b = Number(currentColor.b);
    b = isNaN(b) ? 0 : b > 255 ? 255 : b < 0 ? 0 : b;

    return { r, g, b };
  };
  const validateAlpha = () => {
    let a = Number(currentColor.a);
    a = isNaN(a) ? 0 : a > 1 ? 1 : a < 0 ? 0 : a;
    return a;
  };

  const inputUpdated = (type: 'rgb' | 'a' | 'hex') => {
    if (type == 'rgb') {
      const { r, g, b } = validateRgb();
      const { h, s, v } = RGBtoHSV({ r, g, b });
      nextTick(() => {
        emits('update:hue', h);
        emits('update:sat', s);
        emits('update:val', v);
      });
    } else if (type == 'a') {
      const a = validateAlpha();
      nextTick(() => {
        emits('update:alpha', a);
      });
    } else if (type == 'hex') {
      if (currentColor.hex?.length >= 7) {
        const { hex: newHex } = parseColor(currentColor.hex);
        const { r, g, b } = HEXtoRGB(newHex);
        const { h, s, v } = RGBtoHSV({ r, g, b });
        nextTick(() => {
          emits('update:hue', h);
          emits('update:sat', s);
          emits('update:val', v);
        });
      }
    }
  };

  const onBlurRgb = () => {
    const { r, g, b } = validateRgb();
    currentColor.r = r;
    currentColor.g = g;
    currentColor.b = b;
  };
  const onBlurA = () => {
    const a = validateAlpha();
    currentColor.a = a;
  };
  const onBlurHex = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.length < 7) {
      const { hex } = initColor();
      currentColor.hex = hex;
    } else if (value.length >= 7) {
      const { hex } = parseColor(value.slice(0, 7));
      currentColor.hex = hex;
    }
  };
</script>

<style scoped>
  .input-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .input-content .input-select {
    padding: 2px 4px;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    align-items: center;
    width: 60px;
    height: 24px;
    background: #ffffff;
  }

  .input-content .input-select:focus {
    outline: none;
  }

  .input-content .input-rgb {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
  }
  .input-content .input-rgb .input-rgb-item {
    flex: 1;
    display: flex;
    gap: 12px;
    height: 24px;
  }

  .input-content .input-rgb .input-rgb-item:nth-child(4) {
    width: 40px;
    flex: unset;
  }

  .input-content .input-hex {
    display: flex;
    gap: 4px;
    width: 100%;
  }

  .input-content input {
    flex: 1;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    width: 100%;
    height: 24px;
    appearance: none;
    text-align: center;
    outline: none;
    box-sizing: border-box;
    text-transform: uppercase;
  }

  .input-content input.alpha-input {
    width: 40px;
    flex: unset;
  }
</style>
