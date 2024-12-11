export default {
  primary: {
    900: '#222222',
    800: '#1A1A1A',
    700: '#202020',
    600: '#262626',
    500: '#2B2B2B',
    400: '#363636',
    300: '#404040',
    200: '#4D4D4D',
    100: '#595959',
    50: '#666666',
  },
  secondary: {
    900: '#1A3550',
    800: '#254166',
    700: '#315078',
    600: '#3F5E8A',
    500: '#4D6B9B',
    400: '#5B78AC',
    300: '#6A85BD',
    200: '#7A92CD',
    100: '#8AA0DE',
    50: '#9AACEE',
  },
  beige: '#FFF6F2',
  text: {
    general: { light: '#212121', greyscale: '#616161' },
  },
} as const;

// To create lighter versions of the color #FFF6F2 (a soft peachy white), we incrementally increase the lightness or decrease the saturation of the color. Here are five progressively lighter variations:

// #FFF8F5
// #FFF9F7
// #FFFBF9
// #FFFCFB
// #FFFEFD
