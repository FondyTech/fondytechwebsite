# FondyTech website

Plain HTML, CSS, and JavaScript. No build step, no installs.

## Run it in VS Code
1. Unzip this folder and open it in VS Code (File > Open Folder).
2. Install the "Live Server" extension (VS Code will suggest it).
3. Right-click `index.html` and choose "Open with Live Server".
   Edits reload in the browser automatically.

You can also just double-click `index.html` to open it in a browser.

## Files
- `index.html` - home page
- `services.html`, `business.html`, `work.html`, `pricing.html`, `about.html`, `contact.html` - the other pages
- The header menu and footer are copied into every page. If you change them, change all seven.
- `css/styles.css` - colors, fonts, layout. Brand colors are at the top in `:root`.
- `js/main.js` - home picker, quote builder, contact form, phone menu
- `assets/` - logo and favicon

## Common edits
- **Prices:** in `js/main.js`, edit the `DATA` object near the top. Prices only appear on `pricing.html`.
- **Phone and email:** in `contact.html` and in the footer of every page (search `249-5775` and `contact@fondytech.com`).
- **Contact form:** it doesn't send anything yet. Create a free form at formspree.io, then
  in `js/main.js` replace the "Preview only" message in the submit handler with a
  `fetch("https://formspree.io/f/YOUR_ID", { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })`.
- **Your photo:** replace the cardinal in `about.html` (`class="portrait"`).

## Before launch
- Remove the lock screen: delete the `fondytech-lock.js` script line in the `<head>` of every page
  (the file `js/fondytech-lock.js` can stay or go). To lock it again in your browser for testing,
  run `FondyTechLock.reset()` in the console.
- Connected contact form
- Real ClutchSkins screenshots (with the owner's OK to feature it)
- No reviews until you have real ones

## Put it online (free)
Push the folder to a GitHub repo, then import it on Netlify, Vercel, or Cloudflare Pages
(no build command, publish directory is the root). Add fondytech.com as a custom domain.
