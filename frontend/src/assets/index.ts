/**
 * Asset exports for easy importing throughout the application
 * 
 * Usage:
 * import { logos } from '@/assets';
 */

// Logo imports - Vite automatically handles SVG and image imports as URLs
import logo2Svg from './logos/logo2.svg';
import logo2Png from './images/logo2.png';
import textLogoSvg from './logos/textlogo.svg';
import textLogoPng from './images/textlogo.png';

// Export logos
export const logos = {
  main: logo2Svg,
  png: logo2Png,
  textLogo: textLogoSvg,
  textLogoPng: textLogoPng,
};

// Image imports (add your image files here)
// Example:
// import heroBg from './images/hero/hero-bg.jpg';
// import placeholderProperty from './images/placeholders/property-placeholder.jpg';

// Export images
export const images = {
  // hero: {
  //   background: heroBg,
  // },
  // placeholders: {
  //   property: placeholderProperty,
  // },
};

// Re-export everything
export default {
  logos,
  images,
};

