/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 20s ease infinite',
        'float': 'float 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'float-delayed': 'float 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite 2.7s',
        'float-slow': 'float 12s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite 1.3s',
        'bounce': 'bounce 2s infinite',
        'spin': 'spin 3s linear infinite',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-in': 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-in': 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'rotate-in': 'rotateIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'shake': 'shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'celebrate': 'celebrate 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sparkle': 'sparkle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'elastic': 'elastic 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'levitate': 'levitate 4s ease-in-out infinite',
        'drift': 'drift 10s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'aurora': 'aurora 12s ease-in-out infinite',
        'liquid': 'liquid 8s ease-in-out infinite',
        'constellation': 'constellation 15s linear infinite',
        'reveal': 'reveal 1s cubic-bezier(0.77, 0, 0.175, 1)',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 50%',
          },
          '25%': {
            'background-size': '400% 400%',
            'background-position': '100% 50%',
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': '50% 100%',
          },
          '75%': {
            'background-size': '400% 400%',
            'background-position': '0% 100%',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotateX(0deg)',
          },
          '33%': {
            transform: 'translateY(-30px) rotateX(5deg)',
          },
          '66%': {
            transform: 'translateY(-15px) rotateX(-3deg)',
          },
        },
        'bounceIn': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3) translateY(50px)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05) translateY(-10px)',
          },
          '70%': {
            transform: 'scale(0.95) translateY(5px)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        'slideIn': {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slideUp': {
          'from': {
            opacity: '0',
            transform: 'translateY(100%)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slideDown': {
          'from': {
            opacity: '0',
            transform: 'translateY(-100%)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fadeIn': {
          'from': {
            opacity: '0',
          },
          'to': {
            opacity: '1',
          },
        },
        'scaleIn': {
          'from': {
            opacity: '0',
            transform: 'scale(0.8) translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        'rotateIn': {
          'from': {
            opacity: '0',
            transform: 'rotate(-360deg) scale(0.5)',
          },
          'to': {
            opacity: '1',
            transform: 'rotate(0deg) scale(1)',
          },
        },
        'shake': {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '10%, 30%, 50%, 70%, 90%': {
            transform: 'translateX(-8px) rotate(-1deg)',
          },
          '20%, 40%, 60%, 80%': {
            transform: 'translateX(8px) rotate(1deg)',
          },
        },
        'celebrate': {
          '0%': {
            transform: 'scale(1) rotate(0deg)',
          },
          '25%': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '50%': {
            transform: 'scale(1.2) rotate(-5deg)',
          },
          '75%': {
            transform: 'scale(1.1) rotate(3deg)',
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 60px rgba(139, 92, 246, 0.8), 0 0 120px rgba(139, 92, 246, 0.4)',
            transform: 'scale(1.02)',
          },
        },
        'sparkle': {
          '0%, 100%': {
            opacity: '0',
            transform: 'scale(0) rotate(0deg)',
          },
          '25%': {
            opacity: '1',
            transform: 'scale(1) rotate(90deg)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.2) rotate(180deg)',
          },
          '75%': {
            opacity: '1',
            transform: 'scale(0.8) rotate(270deg)',
          },
        },
        'ripple': {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
        'elastic': {
          '0%': {
            transform: 'scale(0)',
          },
          '55%': {
            transform: 'scale(1.1)',
          },
          '70%': {
            transform: 'scale(0.9)',
          },
          '80%': {
            transform: 'scale(1.05)',
          },
          '90%': {
            transform: 'scale(0.98)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        'glow': {
          'from': {
            textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
          },
          'to': {
            textShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.6)',
          },
        },
        'levitate': {
          '0%, 100%': {
            transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)',
          },
          '25%': {
            transform: 'translateY(-20px) rotateX(5deg) rotateY(5deg)',
          },
          '50%': {
            transform: 'translateY(-35px) rotateX(0deg) rotateY(10deg)',
          },
          '75%': {
            transform: 'translateY(-20px) rotateX(-5deg) rotateY(5deg)',
          },
        },
        'drift': {
          '0%, 100%': {
            transform: 'translateX(0px) translateY(0px)',
          },
          '25%': {
            transform: 'translateX(20px) translateY(-10px)',
          },
          '50%': {
            transform: 'translateX(-15px) translateY(-20px)',
          },
          '75%': {
            transform: 'translateX(-25px) translateY(15px)',
          },
        },
        'breathe': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.8',
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '1',
          },
        },
        'aurora': {
          '0%, 100%': {
            opacity: '0.3',
            transform: 'translateX(0%) scaleY(1)',
          },
          '25%': {
            opacity: '0.8',
            transform: 'translateX(25%) scaleY(1.2)',
          },
          '50%': {
            opacity: '0.6',
            transform: 'translateX(50%) scaleY(0.8)',
          },
          '75%': {
            opacity: '0.9',
            transform: 'translateX(75%) scaleY(1.1)',
          },
        },
        'liquid': {
          '0%, 100%': {
            borderRadius: '50% 40% 60% 50% / 60% 50% 50% 40%',
          },
          '25%': {
            borderRadius: '40% 60% 50% 60% / 50% 60% 40% 60%',
          },
          '50%': {
            borderRadius: '60% 50% 40% 50% / 40% 50% 60% 50%',
          },
          '75%': {
            borderRadius: '50% 60% 50% 40% / 60% 40% 50% 60%',
          },
        },
        'constellation': {
          '0%': {
            transform: 'rotate(0deg) scale(1)',
            opacity: '0.7',
          },
          '50%': {
            opacity: '1',
            transform: 'rotate(180deg) scale(1.1)',
          },
          '100%': {
            transform: 'rotate(360deg) scale(1)',
            opacity: '0.7',
          },
        },
        'reveal': {
          'from': {
            opacity: '0',
            transform: 'translateY(50px) rotateX(20deg)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0) rotateX(0deg)',
          },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(139, 92, 246, 0.3)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.7), 0 0 60px rgba(139, 92, 246, 0.3)',
        'glow-xl': '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.4)',
        'glow-2xl': '0 0 50px rgba(139, 92, 246, 0.9), 0 0 100px rgba(139, 92, 246, 0.5)',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'elastic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
        'swift': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
};