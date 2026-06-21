/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        changa: ['"Changa One"', 'cursive'],
        lusitana: ['Lusitana', 'serif'],
      },
    },
  },
  plugins: [],
}