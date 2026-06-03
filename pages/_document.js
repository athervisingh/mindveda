import { Html, Head, Main, NextScript } from 'next/document'

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'MindVeda by Babita',
  alternateName: ['MindVeda', 'Mind Veda', 'Mindveda by Babita'],
  url: 'https://www.mindvedabybabita.com',
  logo: 'https://www.mindvedabybabita.com/logo.png',
  image: 'https://www.mindvedabybabita.com/hero2.webp',
  email: 'mindvedabybabita@gmail.com',
  telephone: '+919211488516',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Delhi',
    addressRegion: 'Delhi',
    addressCountry: 'IN',
  },
  founder: {
    '@type': 'Person',
    name: 'Babita',
    jobTitle: 'Certified Psychologist & Wellness Coach',
    description: 'Babita is a certified psychologist with 15+ years of experience in counselling, yoga and holistic wellness, serving 1000+ clients across India.',
    url: 'https://www.mindvedabybabita.com/expert',
    image: 'https://www.mindvedabybabita.com/hero2.webp',
    knowsAbout: ['Psychology', 'Anxiety Therapy', 'Depression Counselling', 'Couples Therapy', 'Child Counselling', 'Yoga', 'Mindfulness', 'Mental Health'],
    worksFor: { '@type': 'Organization', name: 'MindVeda' },
  },
  serviceArea: { '@type': 'Country', name: 'India' },
  areaServed: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Noida', 'Gurgaon', 'Chennai', 'Kolkata', 'Jaipur', 'India'],
  priceRange: '₹₹',
  description: 'MindVeda by Babita offers certified online counselling, yoga and spiritual retreats across India. Specialising in anxiety, depression, couples therapy, child counselling and career guidance.',
  medicalSpecialty: 'Psychiatry',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Counselling & Wellness Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Individual Counselling', url: 'https://www.mindvedabybabita.com/book/individual-counseling' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Anxiety Counselling', url: 'https://www.mindvedabybabita.com/book/anxiety-counseling' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Depression Counselling', url: 'https://www.mindvedabybabita.com/book/depression-counseling' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Couples Counselling', url: 'https://www.mindvedabybabita.com/book/couples-counseling' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Child Counselling', url: 'https://www.mindvedabybabita.com/book/child-counseling' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Career Counselling', url: 'https://www.mindvedabybabita.com/book/career-counseling' } },
    ],
  },
  sameAs: [
    'https://www.instagram.com/mindvedabybabita',
    'https://www.facebook.com/mindvedabybabita',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MindVeda by Babita',
  url: 'https://www.mindvedabybabita.com',
  description: 'Online counselling, yoga and wellness retreats by certified psychologist Babita. Serving all of India.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.mindvedabybabita.com/services?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Great+Vibes&family=Lato:wght@300;400;600&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
