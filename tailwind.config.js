/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cb': {
          'black': '#000000',
          'gold': '#FFD700',
          'gold-dark': '#B8860B',
          'white': '#FFFFFF',
          'gray-dark': '#111111',
          'gray-medium': '#333333',
          'gray-light': '#666666',
          'red-rage': '#DC2626'
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif']
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'scale-up': 'scaleUp 0.2s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-gold': 'bounceGold 1s infinite'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' }
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)' }
        },
        bounceGold: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0px)' },
          '40%, 43%': { transform: 'translateY(-15px)' },
          '70%': { transform: 'translateY(-7px)' },
          '90%': { transform: 'translateY(-3px)' }
        }
      },
      boxShadow: {
        'cb-premium': '0 25px 50px -12px rgba(255, 215, 0, 0.25)',
        'cb-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'cb-glow': '0 0 30px rgba(255, 215, 0, 0.3)',
        'cb-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'cb-rage': '0 0 20px rgba(220, 38, 38, 0.3)'
      },
      backdropBlur: {
        'xs': '2px'
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #111111 100%)',
        'gradient-rage': 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide')
  ]
}