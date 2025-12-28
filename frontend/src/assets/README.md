# Assets Directory

This directory contains all static assets for the MyGround application.

## Structure

- **`logos/`** - Brand logos and icons
  - `logo.svg` or `logo.png` - Main MyGround logo
  - `logo-icon.svg` - Favicon/icon version
  - `logo-white.svg` - White version for dark backgrounds

- **`images/`** - General images and graphics
  - `hero/` - Hero section images
  - `placeholders/` - Placeholder images
  - `icons/` - Custom icon images (if not using Heroicons)

- **`fonts/`** - Custom font files
  - Add your custom font files here (`.woff`, `.woff2`, `.ttf`, `.otf`)

## Usage

### Importing Images/Logos in React Components

```tsx
import logo from '@/assets/logos/logo.svg';
import heroImage from '@/assets/images/hero/hero-bg.jpg';

// Use in JSX
<img src={logo} alt="MyGround Logo" />
```

### Using Fonts

1. Add font files to `assets/fonts/`
2. Import in `index.css`:

```css
@font-face {
  font-family: 'YourFont';
  src: url('./assets/fonts/YourFont.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}
```

3. Use in Tailwind config or CSS:

```css
body {
  font-family: 'YourFont', sans-serif;
}
```

## Notes

- Keep file sizes optimized for web
- Use SVG for logos when possible
- Compress images before adding
- Follow naming conventions: `kebab-case` for file names


