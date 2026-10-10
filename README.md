# 199Bazar - Frontend

React + Vite + Tailwind CSS v4 storefront (frontend only, sample data).

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Pages
Home, Shop (search, category / price / rating filters, sorting), Product, Cart (coupons), Checkout (validated form), Order success, Wishlist, Login / Sign up (UI).

## Where to change things
- `src/data/products.js` - products. Add `image: "https://..."` to a product to show a real photo instead of the emoji tile.
- `src/data/categories.js` - categories.
- `src/utils/config.js` - free-delivery limit, delivery fee, demo coupons (BAZAR10, WELCOME50).
- `src/assets/` - logo files. `public/favicon.png` - favicon.
- Cart and wishlist are saved in the browser (localStorage).

## Connect a backend later
- Products: replace the import from `src/data/products.js` with an API call.
- Orders: `src/pages/Checkout.jsx` (see the TODO comment).
- Login: `src/pages/Login.jsx` (see the TODO comment).
