export interface I_RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface I_HSV {
  h: number;
  s: number;
  v: number;
}

export interface I_Color {
  hex: string;
  hexa: string;
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface I_HSL {
  h: number;
  s: number;
  l: number;
}

export type T_Color = I_RGB | I_HSV | I_HSL;
