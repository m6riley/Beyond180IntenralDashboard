declare module 'echarts/dist/echarts.esm.min.js' {
  import type { ECharts } from 'echarts';

  export function init(
    dom: HTMLElement,
    theme?: string | object,
    opts?: {
      renderer?: 'canvas' | 'svg';
      width?: number | string;
      height?: number | string;
      locale?: string;
    },
  ): ECharts;
}
