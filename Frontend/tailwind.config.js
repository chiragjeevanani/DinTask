import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Strict user-requested palette
                "primary": {
                    DEFAULT: "#2c7777",
                    foreground: "#ffffff",
                    50: "#effcfc",
                    100: "#dbeceb", // light bg
                    200: "#b5d9d8",
                    300: "#86bfbe",
                    400: "#5ba1a0",
                    500: "#3d8685",
                    600: "#2c7777", // This matches the base
                    700: "#266061",
                    800: "#234e4f",
                    900: "#204142",
                },
                "background-light": "#f9fafa",
                "background-dark": "#22252a",

                // Text colors from user's HTML
                "text-main": "#111818",     // text-[#111818]
                "text-secondary": "#5e8787", // text-[#5e8787]

                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                // ... keeping existing shadcn vars for fallback/compatibility with other pages if needed
            },
            fontFamily: {
                display: ["Manrope", "sans-serif"],
                sans: ["Manrope", "sans-serif"], // Override default sans to Manrope
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [tailwindAnimate],
}
