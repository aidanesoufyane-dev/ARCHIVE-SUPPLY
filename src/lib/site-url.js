export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "http://localhost:3000";
  return new URL(/^https?:\/\//.test(value) ? value : `https://${value}`).origin;
}
