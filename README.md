# Cava de Oro - Premium Tequila Website

A professional e-commerce website for Cava de Oro premium tequila brand in Singapore.

## 🌐 Live Demo

- **Production Site**: https://same-3qk8b0nadid-latest.netlify.app
- **GitHub Repository**: https://github.com/youk55/cava-de-oro-website

## ✨ Features

### E-Commerce Functionality
- 🛒 Full shopping cart system
- 💳 Payment integration (PayNow & PayPal)
- 📧 Order email notifications to order@yoload.asia
- 📱 Mobile-responsive design
- 🎨 Toast notifications with animations
- 💰 Automatic shipping cost calculation ($20 flat rate)

### Multi-Language Support
- 🌍 English (default)
- 🇨🇳 Chinese language toggle

### Product Catalog
- 5 premium tequila products:
  - Tequila Añejo
  - Tequila Extra Añejo
  - Tequila Añejo Cristalino
  - Black Edition (Limited)
  - Mini Bottle Collection

### Contact Integration
- 📞 WhatsApp contact integration
- 📧 Email: yuki.a@yoload.asia
- ☎️ Phone: +65 86895869

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/youk55/cava-de-oro-website.git
cd cava-de-oro-website

# Install dependencies
bun install

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📧 Email Configuration

The project uses EmailJS for order notifications. To enable email functionality:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Set up your email service
3. Create an email template
4. Update the following in `src/app/page.tsx`:
   - `YOUR_PUBLIC_KEY` → Your EmailJS public key
   - `YOUR_SERVICE_ID` → Your EmailJS service ID
   - `YOUR_TEMPLATE_ID` → Your EmailJS template ID

See `emailjs-setup.md` for detailed instructions.

## 🏗️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Runtime**: Bun
- **Email**: EmailJS
- **Deployment**: Netlify (Static Export)

## 📦 Build & Deploy

### Build for Production

```bash
# Build static site
bun run build

# The output will be in the `out` directory
```

### Deploy to Netlify

The site is configured for static export and can be deployed to Netlify:

```bash
# Deploy command is already configured in package.json
bun run build
```

See `DEPLOYMENT-GUIDE.md` for detailed deployment instructions.

## 📱 Mobile Support

The website is fully responsive and optimized for:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

Features mobile hamburger menu and touch-friendly UI elements.

## 🎨 Customization

### Colors
The site uses a professional color scheme:
- Primary: Amber/Gold tones
- Secondary: Green (WhatsApp integration)
- Accent: Dark gray/Black

### Products
Edit product data in `src/app/page.tsx` under the `productData` array.

### Translations
Update translations in `src/app/page.tsx` under the `translations` object.

## 📄 License

Copyright © Cava de Oro - All Rights Reserved

## 🤝 Support

For questions or support, contact:
- **Email**: yuki.a@yoload.asia
- **Phone**: +65 86895869
- **WhatsApp**: +65 86895869

---

🤖 Generated with [Same](https://same.new)
