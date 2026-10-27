# FondyTech website

Marketing site for FondyTech, a veteran-owned local tech business in Fond du Lac, Wisconsin
(computer/phone repair, home WiFi and mesh, small business IT, websites, software, holiday media digitizing).
Owner: Jon, a software developer.

## Current stack
Plain static site: `index.html`, `css/styles.css`, `js/main.js`, `assets/`. No build step.
Home and Pricing are two views in one page, switched by the URL hash (`#pricing`).
Keep the design, copy, colors, and behavior as they are unless asked to change them.

## Rules
- Prices live ONLY in the `DATA` object in `js/main.js` and appear only on the Pricing view.
- Brand: red #C41E3A, ink #141112, white; dark mode tokens in `:root` blocks. Fonts: Archivo, Instrument Sans, JetBrains Mono.
- The cardinal mark is original. Never use Fond du Lac High School or St. Louis Cardinals logos.
- Voice: plain, friendly, short sentences, no hype.
- Contact: phone (920) 249-5775, email contact@fondytech.com. Contact form not connected yet (Formspree planned).
- No fake reviews or testimonials.
- Pre-launch, `index.html` loads `js/fondytech-lock.js` (an "under construction" password screen; only a SHA-256 hash is in the tag). Don't remove it unless asked. Removing it is a launch step.
- Mobile-first, no horizontal scroll at 360px, visible focus states, prefers-reduced-motion respected.

## Possible next step
Migrate to Astro with real `/` and `/pricing` pages and prices moved to `src/data/pricing.ts`, keeping the same look.
