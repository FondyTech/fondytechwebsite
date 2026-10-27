# FondyTech website

Marketing site for FondyTech, a veteran-owned local tech business in Fond du Lac, Wisconsin
(computer/phone repair, home WiFi and mesh, small business IT, websites, software, holiday media digitizing).
Owner: Jon, a software developer.

## Current stack
Plain static site, no build step. Seven pages: `index.html` (home), `services.html`, `business.html`, `work.html`, `pricing.html`, `about.html`, `contact.html`, sharing `css/styles.css` and `js/main.js`.
The header, menu, and footer are copied into every page, so a nav or footer change means editing all seven.
`main.js` runs only the parts a page has (picker, quote builder, contact form). Pages hand off through the URL: `pricing.html?add=residential:w-mesh` pre-checks a service, `contact.html?need=...&quote=...` fills the contact form.
Keep the design, copy, colors, and behavior as they are unless asked to change them.

## Rules
- Prices live ONLY in the `DATA` object in `js/main.js` and appear only on the Pricing page.
- Brand: red #C41E3A, ink #141112, white; dark mode tokens in `:root` blocks. Fonts: Archivo, Instrument Sans, JetBrains Mono.
- The cardinal mark is original. Never use Fond du Lac High School or St. Louis Cardinals logos.
- Voice: plain, friendly, short sentences, no hype.
- Contact: phone (920) 249-5775, email contact@fondytech.com. Contact form not connected yet (Formspree planned).
- No fake reviews or testimonials.
- Pre-launch, every page loads `js/fondytech-lock.js` (an "under construction" password screen; only a SHA-256 hash is in the tag). Don't remove it unless asked. Removing it is a launch step.
- Mobile-first, no horizontal scroll at 360px, visible focus states, prefers-reduced-motion respected.

## Possible next step
Migrate to Astro so the header and footer live in one shared layout, with prices moved to `src/data/pricing.ts`, keeping the same look.
