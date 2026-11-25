# Google Search Console and Analytics Setup

## Domain verification

1. Open Google Search Console and add `https://afshacreative.in/` as a URL prefix or Domain property.
2. Verify using the DNS TXT record method for `afshacreative.in`, or another method supported by your hosting provider.
3. Do not claim verification is complete until the Search Console dashboard confirms it.

## Sitemap submission

1. Deploy the production build.
2. Visit `https://afshacreative.in/sitemap.xml` and confirm it loads.
3. In Google Search Console, submit `https://afshacreative.in/sitemap.xml`.
4. Monitor the "Sitemaps" report for errors.

## Indexing checks

- Use the URL Inspection tool for the homepage, a product page, a category page, and a blog article.
- Request indexing only after pages are complete and deployed.
- Check that `/admin` and `/api` are not indexed; `robots.txt` disallows them.

## Analytics

Set these environment variables in production when ready:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GTM_ID`

The site includes an `Analytics` component that loads Google Analytics 4 or Google Tag Manager only when these variables are present.

## Conversion tracking

Track these events in GA4/GTM:

- Contact form submissions from `/contact`
- WhatsApp link clicks
- Product enquiry button clicks
- Admin login is not a public conversion and should not be tracked publicly

## Google Business Profile

1. Create or claim the Google Business Profile for Afsha Creative Solution.
2. Use the business name, address, phone number, and email consistently with the website.
3. Add photos of real projects and products.
4. Add service categories related to metal fabrication, gates, and railings.
5. Keep operating hours accurate; do not publish unconfirmed hours.

## Local business details used on the website

- Name: Afsha Creative Solution
- Address: Harthala, Lodhipur, Moradabad, Uttar Pradesh 244001
- Phone: +91 96347 76691
- Email: afshacreativesolutions@gmail.com
- Website: https://afshacreative.in/