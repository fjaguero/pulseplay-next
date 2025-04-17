/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F2937', // gray-800
          light: '#374151',   // gray-700
          dark: '#111827',    // gray-900
        },
        accent: {
          DEFAULT: '#3B82F6', // blue-500
          light: '#60A5FA',   // blue-400
          dark: '#2563EB',    // blue-600
        }
      },
    },
  },
  plugins: [],
}

