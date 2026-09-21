# ARCHIVE/SUPPLY

An independent sneaker store demo with a Next.js storefront, MongoDB product and order storage, cash-on-delivery checkout, stock reservations, newsletter signups, and a private operations dashboard.

## Deploy on Vercel

1. Import `https://github.com/aidanesoufyane-dev/ARCHIVE-SUPPLY` into Vercel. Keep the **Root Directory** at the repository root and use the **Next.js** framework preset. The default `npm run build` command is sufficient.
2. Add these environment variables to **Production** (and Preview if needed):

   | Variable | Purpose |
   | --- | --- |
   | `MONGODB_URI` | MongoDB Atlas URI with a database name and read/write access. The cluster must support transactions. |
   | `ADMIN_PATH` | Private dashboard path, beginning with `/`. Do not use `/dashboard`. |
   | `ADMIN_ACCESS_KEY` | Strong secret used for dashboard login. |
   | `ADMIN_SESSION_TOKEN` | A different, long random secret for admin sessions. |
   | `NEXT_PUBLIC_SITE_URL` | Public canonical URL, such as `https://your-domain.vercel.app`. Update it after assigning a custom domain. |

3. In MongoDB Atlas, allow connections from the deployed Vercel functions and confirm that the database user can read and write the chosen database. Orders and stock changes use MongoDB transactions, so a replica set or Atlas cluster is required.
4. Deploy. Visit `/shop`, submit a test COD order, and sign in at your configured `ADMIN_PATH` to confirm that the order, inventory and newsletter sections work. Cancel the test order to release its reserved stock.

The dashboard route is absent from the public navigation and sitemap. Keep all secret variables in Vercel settings, never in the repository. `.env.example` lists the required keys; `.env` is ignored by Git.

## Local development

Use Node.js 20.9 or newer. Copy `.env.example` to `.env`, fill in local values, then run:

```bash
npm ci
npm run dev
```

Check before deploying:

```bash
npm run lint
npm run build
```

Product images are served from `public/assets/products`. Dashboard product editing accepts paths to files already in that folder; it does not upload images. Newsletter signups are stored in MongoDB; sending marketing emails requires a separate email service.
