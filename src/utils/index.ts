import { colorKeywords } from '@/data';
import type { I_Color, I_HSV, I_RGB } from '@/types';

/** To HEX */
export const componentToHex = (c: number): string => {
  const hex = c.toString(16).toUpperCase();
  return hex.length == 1 ? '0' + hex : hex;
};

/** Parse Color */
export const parseColor = (color: string): I_Color => {
  let hexAlphaArr = [];
  hexAlphaArr = cleanHexAlpha(color).substr(1).split('');
  if (color.startsWith('#')) {
    // #000000
    hexAlphaArr = cleanHexAlpha(color).substr(1).split('');
  } else if (color.startsWith('rgb') || color.startsWith('rgba')) {
    // rgb(0, 0, 0)
    const rgbObj = getRGBFromString(color);
    console.log('rgbObj: ', rgbObj, componentToHex(Math.round(rgbObj.a!)));
    const hexString = RGBtoHEX(rgbObj) + componentToHex(Math.round(rgbObj.a! * 255));
    hexAlphaArr = cleanHexAlpha(hexString).substr(1).split('');
  } else {
    // Keywords
    const hexString = colorKeywords?.[color] ?? '#000000FF';
    hexAlphaArr = cleanHexAlpha(hexString).substr(1).split('');
  }

  const h = hexAlphaArr[0] + hexAlphaArr[1];
  const e = hexAlphaArr[2] + hexAlphaArr[3];
  const x = hexAlphaArr[4] + hexAlphaArr[5];
  const ha = hexAlphaArr[6] + hexAlphaArr[7];

  const r = parseInt(h, 16);
  const g = parseInt(e, 16);
  const b = parseInt(x, 16);
  const a = parseInt(ha, 16) / 255;

  return {
    hex: '#' + h + e + x,
    hexa: '#' + h + e + x + ha,
    r,
    g,
    b,
    a,
  };
};
const cleanHexAlpha = (hexAlpha: string): string => {
  if (!hexAlpha || hexAlpha.length < 3) return '#000000FF';

  let _cleaned = hexAlpha.toUpperCase();
  if (_cleaned.startsWith('#')) _cleaned = _cleaned.substr(1);
  if (_cleaned.length < 3) return '#000000FF';

  let r, g, b, a;
  r = g = b = '00';
  a = 'FF';

  if (_cleaned.length === 3) {
    // #000 -> #000000
    const newCleaned = _cleaned.repeat(2);
    const rgb = newCleaned.split('').map((r: string) => validateHexChar(r));
    r = rgb[0] + rgb[1];
    g = rgb[2] + rgb[3];
    b = rgb[4] + rgb[5];
  } else if (_cleaned.length >= 6) {
    // #00000000 -> #000000
    const rgb = _cleaned.split('').map((r: string) => validateHexChar(r));
    r = rgb[0] + rgb[1];
    g = rgb[2] + rgb[3];
    b = rgb[4] + rgb[5];
    if (rgb.length === 8) {
      a = rgb[6] + rgb[7];
    }
  }
  return `#${r}${g}${b}${a}`;
};

const validateHexChar = (c: string): string => {
  if (c.length < 0 || c.length > 1) return '0';
  if (isNaN(Number(c))) {
    const validChars = ['A', 'B', 'C', 'D', 'E', 'F'];
    if (validChars.includes(c.toUpperCase())) {
      return c.toUpperCase();
    } else {
      return '0';
    }
  } else {
    return c;
  }
};
const getRGBFromString = (color: string): I_RGB => {
  const regex = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([\d.]+))?\)/;
  const match = color.match(regex);

  if (match) {
    const r = match[1];
    const g = match[2];
    const b = match[3];
    const a = match[4] || 1;

    return {
      r: Number(r),
      g: Number(g),
      b: Number(b),
      a: Number(a),
    };
  } else {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    };
  }
};

/** calculate Line Color */
export const calculateLineColor = (linePos: number, lineWidth: number): I_RGB => {
  const percent = linePos / lineWidth;
  const value = percent % (1 / 6);
  const colorPercent = value / (1 / 6);

  let percentRed = 1;
  let percentGreen = 1;
  let percentBlue = 1;

  if (percent < 1 / 6) {
    percentGreen = colorPercent;
    percentBlue = 0;
  } else if (percent < 2 / 6) {
    percentRed = 1 - colorPercent;
    percentBlue = 0;
  } else if (percent < 3 / 6) {
    percentRed = 0;
    percentBlue = colorPercent;
  } else if (percent < 4 / 6) {
    percentRed = 0;
    percentGreen = 1 - colorPercent;
  } else if (percent < 5 / 6) {
    percentRed = colorPercent;
    percentGreen = 0;
  } else {
    percentGreen = 0;
    percentBlue = 1 - colorPercent;
  }

  return {
    r: Math.min(255, Math.max(0, Math.round(percentRed * 255))),
    g: Math.min(255, Math.max(0, Math.round(percentGreen * 255))),
    b: Math.min(255, Math.max(0, Math.round(percentBlue * 255))),
  };
};

/** RGB To HUE */
export const RGBToHUE = ({ r, g, b }: I_RGB): number => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  if (max == min) {
    return 0;
  } else {
    if (max == r && g >= b) {
      return (60 * (g - b)) / (max - min);
    } else if (max == r && g < b) {
      return (60 * (g - b)) / (max - min) + 360;
    } else if (max == g) {
      return (60 * (b - r)) / (max - min) + 120;
    } else if (max == b) {
      return (60 * (r - g)) / (max - min) + 240;
    } else {
      return 0;
    }
  }
};

/** HUE To RGB */
export const HUEtoRGB = (h: number): I_RGB => {
  const doHandle = (num: number) => {
    if (num > 255) {
      return 255;
    } else if (num < 0) {
      return 0;
    } else {
      return Math.round(num);
    }
  };

  const hueRGB = (h / 60) * 255;
  const r = doHandle(Math.abs(hueRGB - 765) - 255);
  const g = doHandle(510 - Math.abs(hueRGB - 510));
  const b = doHandle(510 - Math.abs(hueRGB - 1020));

  return {
    r,
    g,
    b,
  };
};

/** RGB To HEX */
export const RGBtoHEX = (color: I_RGB): string => {
  const { r, g, b } = color;

  const red = componentToHex(Math.round(r));
  const green = componentToHex(Math.round(g));
  const blue = componentToHex(Math.round(b));

  return `#${red}${green}${blue}`;
};

/** HEX To RGB */
export const HEXtoRGB = (hex: string): I_RGB => {
  const hexString = hex.substring(1);
  const hexNum = Number('0x' + (hexString.length < 6 ? repeatLetter(hexString, 2) : hexString));
  const r = hexNum >> 16;
  const g = (hexNum >> 8) & 0xff;
  const b = hexNum & 0xff;

  function repeatWord(word: string, num: number): string {
    let result = '';
    for (let i = 0; i < num; i++) {
      result += word;
    }
    return result;
  }
  function repeatLetter(word: string, num: number): string {
    let result = '';
    for (const letter of word) {
      result += repeatWord(letter, num);
    }
    return result;
  }

  return {
    r,
    g,
    b,
  };
};

/** RGB To HSV　*/
export const RGBtoHSV = ({ r, g, b }: I_RGB): I_HSV => {
  r = r / 255; // [0, 1]
  g = g / 255; // [0, 1]
  b = b / 255; // [0, 1]

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  const v = max;
  const s = max === 0 ? 0 : d / max;

  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h = h / 6;
  }
  return { h: h * 360, s, v };
};

/** HSV To RGB */
export const HSVtoRGB = ({ h, s, v }: I_HSV): I_RGB => {
  let i, f, p1, p2, p3;
  let r = 0,
    g = 0,
    b = 0;

  if (s < 0) s = 0;
  if (s > 1) s = 1;
  if (v < 0) v = 0;
  if (v > 1) v = 1;

  h %= 360;
  if (h < 0) h += 360;
  h /= 60;

  i = Math.floor(h);
  f = h - i;
  p1 = v * (1 - s);
  p2 = v * (1 - s * f);
  p3 = v * (1 - s * (1 - f));

  switch (i) {
    case 0:
      r = v;
      g = p3;
      b = p1;
      break;
    case 1:
      r = p2;
      g = v;
      b = p1;
      break;
    case 2:
      r = p1;
      g = v;
      b = p3;
      break;
    case 3:
      r = p1;
      g = p2;
      b = v;
      break;
    case 4:
      r = p3;
      g = p1;
      b = v;
      break;
    case 5:
      r = v;
      g = p1;
      b = p2;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
  // return 'rgb(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ')'
};
