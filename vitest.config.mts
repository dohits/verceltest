import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'), // TailwindCSS 플러그인
        require('autoprefixer'), // 자동 접두어 추가
      ],
    },
  },
});
