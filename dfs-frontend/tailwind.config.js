const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      maxWidth: {
        '1/5': '20%',
      },
      minWidth: {
        '1/2': '50%',
        '2/5': '40%',
        '230': '230px',
      },
      screens: {
        'lg': {'max':'1060px'},
        'xs': {'max':'550px'},
        'md':{'max':'700px'},
        '2lg':'1060px',
        // => @media (min-width: 1440px) { ... }
      },
      listStyleType: {
        square: 'square',
      },
      fontFamily: {
        'var': ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        '3xl': '0px 0px 20px 0px #999',
        'sign-in':'5px 10px 5px #EEEEEE',
      },
      colors: {
        'blue-green-0': '#031B34',
        'blue-green-1': '#04284c',
        'blue-green-2': '#063464',
        'nav-red' : '#FF4820',
        'fn-blue' : '#254d79',
        'slate-150': '#eeeeee',
        'nav-active': '#007bff',
        'light-black': "#333333",
        'grad-pink': '#AE67FA',
        'grad-yel':'#F49867',
        'fn-bg':'#f3f4f6',
        'table-shade' :'#f2f2f2',
        'btn-sky': '#17a2b8',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/forms'),
    plugin(function( {addUtilities }) {
      addUtilities({
        /* Hide scrollbar for Chrome, Safari and Opera */
        '.no-scrollbar::-webkit-scrollbar' : {
          'display': 'none'
        },

        /* Hide scrollbar for IE, Edge and Firefox */
        '.no-scrollbar' : {
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none'  /* Firefox */
        }
      })
    })
  ],
}
