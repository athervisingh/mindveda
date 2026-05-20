import { Html, Head, Main, NextScript } from 'next/document'

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  name: 'MindVeda',
  url: 'https://mindveda.in',
  logo: 'https://mindveda.in/logo.png',
  telephone: '+919211488516',
  email: 'info@mindveda.in',
  address: { '@type': 'PostalAddress', addressCountry: 'IN' },
  founder: { '@type': 'Person', name: 'Babita' },
  serviceArea: { '@type': 'Country', name: 'India' },
  priceRange: '₹₹',
  description: 'MindVeda offers professional counselling, yoga, and spiritual retreats by certified psychologists across India.',
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Great+Vibes&family=Lato:wght@300;400;600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
