/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette from https://coolors.co/palette/5e381a-2e3b44-000001-000000-180a04
        primary: {
          50: '#f7f3f0',
          100: '#ede4dc',
          200: '#dbc9b9',
          300: '#c4a68a',
          400: '#a8825e',
          500: '#5e381a', // Main brown/bronze
          600: '#4d2e15',
          700: '#3c2310',
          800: '#2b180b',
          900: '#180a04', // Very dark brown
        },
        secondary: {
          50: '#f1f3f4',
          100: '#e1e6e8',
          200: '#c3cdd1',
          300: '#9eadb4',
          400: '#748690',
          500: '#2e3b44', // Dark blue-gray
          600: '#252f36',
          700: '#1c2328',
          800: '#13171a',
          900: '#0a0c0d',
        },
        dark: {
          'bg-primary': '#000001', // Near black
          'bg-secondary': '#180a04', // Very dark brown
          'text-primary': '#f7f3f0',
          'text-secondary': '#c4a68a',
          'accent': '#5e381a', // Brown/bronze accent
        },
        accent: {
          50: '#f7f3f0',
          100: '#ede4dc',
          200: '#dbc9b9',
          300: '#c4a68a',
          400: '#a8825e',
          500: '#5e381a',
          600: '#4d2e15',
          700: '#3c2310',
          800: '#2b180b',
          900: '#180a04',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5e381a 0%, #2e3b44 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000001 0%, #180a04 100%)',
        'gradient-accent': 'linear-gradient(135deg, #5e381a 0%, #180a04 100%)',
      },
      fontFamily: {
        'sans': ['Inter', 'Source Sans Pro', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Source Sans Pro', 'Inter', 'system-ui', 'sans-serif'],
        'heading': ['Inter', 'Source Sans Pro', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'invoice': '1200px',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}