module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  safelist: ['tooltip-custom'],

  theme: {
    extend: {
      colors: {
        bgbg: "var(--bgbg)",
        "bgbg-subtle": "var(--bgbg-subtle)",
        "bgdefault-bg": "var(--bgdefault-bg)",
        fgborder: "var(--fgborder)",
        fgline: "var(--fgline)",
        fgsolid: "var(--fgsolid)",
        fgtext: "var(--fgtext)",
        "fgtext-contrast": "var(--fgtext-contrast)",
        "primarybg-active": "var(--primarybg-active)",
        "primaryon-primary": "var(--primaryon-primary)",
        primarysolid: "var(--primarysolid)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        "3xl-semi-bold": "var(--3xl-semi-bold-font-family)",
        "base-medium": "var(--base-medium-font-family)",
        "input-default-medium": "var(--input-default-medium-font-family)",
        "input-medium-semi-bold": "var(--input-medium-semi-bold-font-family)",
        "input-small-medium": "var(--input-small-medium-font-family)",
        "input-small-semi-bold": "var(--input-small-semi-bold-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: { "box-shadow-shadow": "var(--box-shadow-shadow)" },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
