
import { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...fontFamily.sans],
        serif: ["Playfair Display", ...fontFamily.serif],
      },
      colors: {
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
        restaurant: {
          primary: "var(--restaurant-primary)",
          secondary: "var(--restaurant-secondary)",
        },
        taj: {
          burgundy: "var(--taj-burgundy)",
          gold: "var(--taj-gold)",
          dark: "var(--taj-dark)",
          cream: "var(--taj-cream)",
          light: "var(--taj-light)",
        },
        // Custom color scheme based on the provided image
        custom: {
          red: "#5B0018", // burgundy/maroon red from the image
          yellow: "#D4AF37", // gold color from the image
          green: "#43A047", // keeping this for success states
          blue: "#1E88E5", // keeping this for informational states
          purple: "#8E24AA", // luxury purple
          orange: "#FF7043", // energizing orange
          lightRed: "#FFEBEE", // light red background
          lightYellow: "#F5F5DC", // beige/cream background
          lightGreen: "#E8F5E9", // light green background
          lightBlue: "#E3F2FD", // light blue background
          lightPurple: "#F3E5F5", // light purple background
          lightOrange: "#FBE9E7", // light orange background
          darkGray: "#37474F", // deep blue-gray instead of dark gray
          lightGray: "#ECEFF1", // very light blue-gray instead of light gray
        },
      },
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "70%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "bounce-in": "bounce-in 0.5s ease-out forwards",
        "pulse-slow": "pulse-slow 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
