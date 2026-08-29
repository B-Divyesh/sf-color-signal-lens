export type LensMode = 'none' | 'labels' | 'patterns' | 'remap';

export type Rgb = { r: number; g: number; b: number };

export const parseHex = (hex: string): Rgb => {
  const value = hex.replace('#', '');
  return { r: Number.parseInt(value.slice(0, 2), 16), g: Number.parseInt(value.slice(2, 4), 16), b: Number.parseInt(value.slice(4, 6), 16) };
};

export const rgbToHex = ({ r, g, b }: Rgb) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

export const distance = (a: Rgb, b: Rgb) => Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);

export const isNear = (pixel: Rgb, target: Rgb, tolerance = 76) => distance(pixel, target) <= tolerance;

export const detectStatusName = (target: Rgb) => {
  if (target.r > target.g * 1.25 && target.r > target.b * 1.25) return 'Removed / needs attention';
  if (target.g > target.r * 1.1 && target.g > target.b * 1.1) return 'Added / ready';
  if (target.b > target.r * 1.15) return 'Information';
  return 'Selected status color';
};

export const remapPixel = (pixel: Rgb, target: Rgb, mapping: 'blue' | 'orange') =>
  isNear(pixel, target) ? parseHex(mapping === 'blue' ? '#075A86' : '#A94900') : pixel;

export const sampleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
  <rect width="1200" height="720" fill="#fbf6eb"/>
  <rect x="50" y="42" width="1100" height="86" rx="16" fill="#17232e"/>
  <circle cx="94" cy="85" r="13" fill="#b23a28"/><circle cx="132" cy="85" r="13" fill="#d4a72c"/><circle cx="170" cy="85" r="13" fill="#3a8f68"/>
  <text x="220" y="94" fill="#fff8e8" font-family="Arial" font-size="28">revision: checkout totals</text>
  <text x="74" y="181" fill="#4a5965" font-family="Arial" font-size="23">src/cart/total.ts</text>
  <rect x="50" y="210" width="1100" height="192" rx="12" fill="#f5dddd"/>
  <rect x="50" y="425" width="1100" height="192" rx="12" fill="#d9ede0"/>
  <text x="76" y="270" fill="#9c2d20" font-family="monospace" font-size="30">−  return subtotal + tax</text>
  <text x="76" y="326" fill="#9c2d20" font-family="monospace" font-size="30">−  applyLegacyDiscount(total)</text>
  <text x="76" y="486" fill="#16714a" font-family="monospace" font-size="30">+  return subtotal + tax + shipping</text>
  <text x="76" y="542" fill="#16714a" font-family="monospace" font-size="30">+  applyMemberDiscount(total)</text>
  <rect x="878" y="252" width="210" height="72" rx="36" fill="#9c2d20"/><text x="920" y="297" fill="#fff" font-family="Arial" font-size="24">removed</text>
  <rect x="878" y="467" width="210" height="72" rx="36" fill="#16714a"/><text x="936" y="512" fill="#fff" font-family="Arial" font-size="24">added</text>
  <text x="74" y="675" fill="#4a5965" font-family="Arial" font-size="19">Sample screenshot — click a colored line or status chip.</text>
</svg>`;

export const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sampleSvg)}`;
