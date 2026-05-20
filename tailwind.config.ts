import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        canvas:  "var(--surface-canvas)",
        card:    "var(--surface-card)",
        subtle:  "var(--surface-subtle)",
        raised:  "var(--surface-raised)",
        overlay: "var(--surface-overlay)",

        border: {
          DEFAULT: "var(--border-default)",
          subtle:  "var(--border-subtle)",
          strong:  "var(--border-strong)",
        },

        ink: {
          DEFAULT:  "var(--text-default)",
          title:    "var(--text-title)",
          body:     "var(--text-body)",
          subtitle: "var(--text-subtitle)",
          caption:  "var(--text-caption)",
          disabled: "var(--text-disabled)",
          link:     "var(--text-link)",
          inverse:  "var(--text-on-dark)",
        },

        royal: {
          50:  "var(--royal-50)",
          100: "var(--royal-100)",
          200: "var(--royal-200)",
          300: "var(--royal-300)",
          400: "var(--royal-400)",
          500: "var(--royal-500)",
          600: "var(--royal-600)",
          700: "var(--royal-700)",
          800: "var(--royal-800)",
          900: "var(--royal-900)",
        },

        brand: {
          sky:    "var(--tatch-sky)",
          violet: "var(--tatch-violet)",
          peony:  "var(--tatch-peony)",
          royal:  "var(--tatch-royal)",
        },

        success: "var(--color-success)",
        error:   "var(--color-error)",
        warn:    "var(--color-warn)",
      },
      fontFamily: {
        sans:    ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      borderRadius: {
        xs:   "var(--radius-xs)",
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      transitionTimingFunction: {
        snap:     "var(--ease-snap)",
        standard: "var(--ease-standard)",
      },
      transitionDuration: {
        fast: "150ms",
        med:  "250ms",
        slow: "400ms",
      },
      backgroundImage: {
        "brand-gradient":   "var(--tatch-brand-gradient)",
        "brand-gradient-4": "var(--tatch-brand-gradient-4stop)",
      },
    },
  },
  plugins: [],
};
export default config;
