import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ["var(--font-geist-sans)", ...fontFamily.sans]
  		},
		  screens: {
			'mb': {'max': '640px'},
			'tb': {'min': '641px', 'max': '1279px'},
			'lp': {'min': '1280px', 'max': '1919px'},
			'dp': {'min': '1920px'},
		  },
		  fontSize: {
			'c-xs': ['clamp(0.75rem, 1.5vw + 0.25rem, 1rem)', '1.25'],   // Extra Small
			'c-sm': ['clamp(0.875rem, 1.5vw + 0.375rem, 1.125rem)', '1.375'], // Small
			'c-lg': ['clamp(1rem, 1.5vw + 0.5rem, 1.25rem)', '1.5'],       // Large
			'c-xl': ['clamp(1.25rem, 2vw + 0.5rem, 1.5rem)', '1.5'],      // Extra Large
			'c-2xl': ['clamp(1.5rem, 3vw + 0.5rem, 2rem)', '1.5'],       // 2XL
			'c-3xl': ['clamp(1.875rem, 4vw + 0.5rem, 2.5rem)', '1.5'],   // 3XL
			'c-4xl': ['clamp(2.25rem, 5vw + 0.5rem, 3rem)', '1.5'],      // 4XL
			'c-5xl': ['clamp(3rem, 6vw + 0.5rem, 4rem)', '1.5'],         // 5XL
			'c-6xl': ['clamp(3.75rem, 7vw + 0.5rem, 5rem)', '1.5'],      // 6XL
			'c-7xl': ['clamp(4.5rem, 8vw + 0.5rem, 6rem)', '1.5'],       // 7XL
			'c-8xl': ['clamp(6rem, 9vw + 0.5rem, 7rem)', '1.5'],         // 8XL
			'c-9xl': ['clamp(8rem, 10vw + 0.5rem, 9rem)', '1.5'],        // 9XL
		  },
  		}
  	},
	plugins: [
		require('tailwind-scrollbar')
	]
  }

