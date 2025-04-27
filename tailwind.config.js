module.exports = {
  content: ['./**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#3B82F6',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        light: '#F3F4F6',
        dark: '#1F2937',
      },
      spacing: {
        '2xs': 4,
        'xs': 8,
        'sm': 12,
        'md': 16,
        'lg': 20,
        'xl': 24,
        '2xl': 32,
        '3xl': 40,
      },
      borderRadius: {
        'none': 0,
        'sm': 4,
        'md': 8,
        'lg': 12,
        'xl': 16,
        'full': 9999,
      },
    },
  },
  plugins: [],
}; 