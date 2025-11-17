# Lift Me Up - Women's Activewear E-commerce Design Guidelines

## Design Approach
**Reference-Based Approach** drawing inspiration from premium activewear brands (Lululemon, Alo Yoga, Gymshark) combined with clean e-commerce patterns (Allbirds, Everlane). The design prioritizes visual product storytelling with feminine minimalism and energetic, athletic sensibility.

## Core Design Principles
1. **Clean Canvas Philosophy**: White backgrounds let products shine
2. **Energy Through Restraint**: Orange accents create focal points without overwhelming
3. **Bilingual Elegance**: Seamless experience in both English and Arabic (RTL)
4. **Visual Product Focus**: Large, high-quality imagery drives engagement

## Typography System

**Primary Font**: Inter or DM Sans (Google Fonts)
- Hero Headlines: 48-64px, font-weight: 700
- Section Headers: 32-40px, font-weight: 600
- Product Titles: 20-24px, font-weight: 500
- Body Text: 16px, font-weight: 400
- Captions/Meta: 14px, font-weight: 400
- Navigation: 15px, font-weight: 500

**Arabic Typography**: Use Tajawal or Cairo (optimized Arabic fonts)
- Maintain same hierarchy with adjusted sizes for Arabic readability

## Layout System

**Spacing Scale**: Consistent Tailwind units - **2, 4, 6, 8, 12, 16, 20, 24**
- Component padding: p-4 to p-8
- Section spacing: py-12 (mobile), py-20 (desktop)
- Element gaps: gap-4 to gap-8
- Container max-width: max-w-7xl with px-4 padding

**Grid System**:
- Products: 2 columns (mobile), 3 columns (tablet), 4 columns (desktop)
- Categories: 2 columns (mobile), 4 columns (desktop)
- Content sections: Single column (max-w-6xl)

**RTL Support**: Automatic flip for Arabic - all margins, paddings, and flex directions mirror appropriately

## Component Library

### Navigation
- **Desktop**: Horizontal navigation with category dropdowns, centered logo, right-aligned cart/account/language toggle
- **Mobile**: Hamburger menu with slide-out drawer
- Logo: "Lift Me Up" in bold sans-serif (black), height: 40px
- Cart icon with item count badge (orange circle)
- Language switcher: AR/EN toggle (minimal pill design)

### Hero Section
- **Full-width hero image** (1920x800px) showcasing activewear lifestyle
- Image: Women in athletic wear during workout/lifestyle activities, energetic but aspirational
- Overlay: Subtle dark gradient (bottom 40%) for text readability
- Headline overlay: Large, bold white text
- CTA Button: Orange button (bg-orange-500) with **backdrop blur** (backdrop-blur-md bg-opacity-90)
- Height: 80vh (desktop), 60vh (mobile)

### Product Cards
- Image: Square aspect ratio (1:1), hover zoom effect
- Card background: white with subtle border (border-gray-200)
- Product name: font-medium, 18px
- Price: font-semibold, 20px, black
- Quick add button appears on hover (orange, small)
- Sale/New badge: Small orange pill in top-right corner

### Buttons
- **Primary (Orange)**: bg-orange-500, text-white, rounded-md, px-8 py-3, hover:bg-orange-600
- **Secondary (Outline)**: border-2 border-black, text-black, hover:bg-black hover:text-white
- **Blurred CTAs on images**: bg-orange-500/90 backdrop-blur-md (no additional hover effects needed)

### Forms
- Input fields: border-gray-300, rounded-md, focus:border-orange-500 focus:ring-orange-500
- Labels: font-medium, 14px, mb-2
- Consistent padding: px-4 py-3

### Cart & Checkout
- Slide-out drawer (right side)
- White background, shadow-2xl
- Item cards: thumbnail, name, size/color, quantity controls, remove icon
- Total section: Bold, larger font at bottom
- Checkout button: Full-width orange button

### Admin Panel
- Sidebar navigation (dark gray bg-gray-900)
- Main content area: light gray background (bg-gray-50)
- Data tables: White cards with borders
- Action buttons: Small orange buttons for primary actions
- Dashboard cards: White with shadow, showing metrics with large numbers and trend indicators

## Color Specifications (Implementation Reference)

**Brand Colors**:
- Background: White (#FFFFFF)
- Text: Black (#000000)
- Accent: Orange (#F97316 - Tailwind orange-500)
- Subtle borders: Gray-200 (#E5E7EB)
- Hover states: Orange-600 (#EA580C)

## Images

**Required Images**:
1. **Hero Section**: Full-width lifestyle image of women in activewear (workout/athleisure context), energetic and aspirational, 1920x800px
2. **Category Tiles**: 4 square images (800x800px) - Performance Shirt, Hooded top, T-Shirt, Cap with white/minimal backgrounds
3. **Product Images**: Multiple angles per product (square format), lifestyle shots showing products in use
4. **About Page**: Team or brand story images (candid, authentic)

**Image Treatment**: Clean, bright, well-lit photography with white or minimal backgrounds for products. Lifestyle images should feel energetic but not overly filtered.

## Animations

**Minimal & Purposeful**:
- Product card hover: Subtle scale (1.02) and shadow increase
- Button hover: Color transition (0.2s ease)
- Cart drawer: Slide-in from right (0.3s ease-out)
- Page transitions: Fade (0.15s)
- **No scroll animations** - keep focus on products

## Page-Specific Layouts

**Home Page**:
1. Hero with CTA (80vh)
2. Featured Categories (4-column grid, py-20)
3. New Arrivals (product grid, py-20)
4. Special Offers banner (full-width, subtle orange background)
5. Social proof/trust badges (py-12)

**Product Page**:
- Left: Image gallery (60% width)
- Right: Product details, size/color selectors, add to cart (40% width)
- Below: Tabs for description/specs/reviews
- Bottom: "You May Also Like" carousel

**Shop Page**:
- Left sidebar: Filters (20% width, sticky)
- Main area: Product grid with sort dropdown (80% width)

**Admin Dashboard**:
- Left sidebar: Dark navigation (fixed, 240px wide)
- Top bar: Stats cards (4 columns showing revenue, orders, products, users)
- Main content: Recent orders table, charts for sales trends

This design system creates a sophisticated, feminine activewear shopping experience that feels premium yet accessible, with orange serving as energetic accent punctuation throughout the clean, product-focused interface.