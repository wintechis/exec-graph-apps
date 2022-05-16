const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),

    ...createGlobPatternsForDependencies(__dirname),
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'fau-blue': '#04316A',
        'fau-dark-blue': '#041E42',
        'fau-red': '#C50F3C',
        'fau-dark-red': '#971B2f0',
      },
    },
  },

  plugins: [],
};
