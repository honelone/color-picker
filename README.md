# color-picker

- 使用`Vue3`实现的颜色选择器

# 示例

- https://honelone.github.io/color-picker/

## 安装

```shell
npm i @honelone/color-picker
```

### 使用

- `color`: 支持大部分颜色值，支持`hex`颜色值，支持`rgba`颜色值

```vue
<template>
  <ColorPicker v-model:color="color" />
  <ColorPanel v-model:color="color" />
</template>
<script setup>
  import { ref } from 'vue';
  import { ColorPicker, ColorPanel } from '@honelone/color-picker';
  const color = ref('#f2f5f7');
</script>
```

> 需要注意的是，仅包含主题内容，外层样式请自行添加
