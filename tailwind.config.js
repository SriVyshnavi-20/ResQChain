/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070d1e',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        brand: {
          900: '#1e3a8a',
          800: '#1e40af',
          700: '#1d4ed8',
          600: '#2563eb',
          500: '#3b82f6',
          100: '#dbeafe',
          50: '#eff6ff',
        },
        sos: {
          700: '#b91c1c',
          600: '#dc2626',
          500: '#ef4444',
          400: '#f87171',
          100: '#fee2e2',
          50: '#fef2f2',
        },
        safe: {
          700: '#15803d',
          600: '#16a34a',
          500: '#22c55e',
          100: '#dcfce7',
          50: '#f0fdf4',
        },
        warn: {
          700: '#b45309',
          600: '#d97706',
          500: '#f59e0b',
          100: '#fef3c7',
          50: '#fffbeb',
        },
        info: {
          700: '#0369a1',
          600: '#0284c7',
          500: '#0ea5e9',
          100: '#e0f2fe',
          50: '#f0f9ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'glow-sos': '0 0 20px rgba(220, 38, 38, 0.35)',
      }
    },
  },
  plugins: [],
}
