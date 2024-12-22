/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				card: 'hsl(var(--card) / <alpha-value>)',
				'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
				popover: 'hsl(var(--popover) / <alpha-value>)',
				'popover-foreground': 'hsl(var(--popover-foreground) / <alpha-value>)',
				primary: 'hsl(var(--primary) / <alpha-value>)',
				'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
				secondary: 'hsl(var(--secondary) / <alpha-value>)',
				'secondary-foreground': 'hsl(var(--secondary-foreground) / <alpha-value>)',
				muted: 'hsl(var(--muted) / <alpha-value>)',
				'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
				accent: 'hsl(var(--accent) / <alpha-value>)',
				'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
				destructive: 'hsl(var(--destructive) / <alpha-value>)',
				'destructive-foreground': 'hsl(var(--destructive-foreground) / <alpha-value>)',
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				chart: {
					1: 'hsl(var(--chart-1) / <alpha-value>)',
					2: 'hsl(var(--chart-2) / <alpha-value>)',
					3: 'hsl(var(--chart-3) / <alpha-value>)',
					4: 'hsl(var(--chart-4) / <alpha-value>)',
					5: 'hsl(var(--chart-5) / <alpha-value>)',
				}
			},
		fontFamily: {
			inter: ['var(--font-inter)'],
			pt: ['var(--font-pt_serif)'],
			serif: ['var(--font-flurries)'],
		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
