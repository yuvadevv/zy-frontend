import { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { Hero } from '@/components/public/Hero';
import { ServiceDiscovery } from '@/components/public/ServiceDiscovery';
import { ProductShowcase } from '@/components/public/ProductShowcase';
import { HowItWorks } from '@/components/public/HowItWorks';
import { ComparisonTable } from '@/components/public/ComparisonTable';
import { CampusEcosystem } from '@/components/public/CampusEcosystem';
import { Features } from '@/components/public/Features';
import { Statistics } from '@/components/public/Statistics';
import { Testimonials } from '@/components/public/Testimonials';
import { FAQ } from '@/components/public/FAQ';
import { About } from '@/components/public/About';
import { CTA } from '@/components/public/CTA';
import { Footer } from '@/components/public/Footer';
import { getPublicPlatformStatus } from '@/lib/api/server/platform';

import { constructMetadata, siteConfig } from '@/lib/seo/metadata';
import Script from 'next/script';
import { RootAuthRedirect } from '@/components/auth/RootAuthRedirect';

import { workerClient } from '@/lib/api/workerClient';

export const metadata: Metadata = constructMetadata({
  canonicalPath: '',
});

export const revalidate = 0;

export default async function LandingPage() {
  const status = await getPublicPlatformStatus();

  let statsData = [];
  let testimonialsData = [];
  let footerData = null;

  try {
    const contentRes = await workerClient.getContent();
    const allContent = contentRes.content || [];

    statsData = allContent.filter((c: any) => c.type === 'statistics');
    testimonialsData = allContent.filter((c: any) => c.type === 'testimonials');
    const footerItems = allContent.filter((c: any) => c.type === 'footer');
    if (footerItems.length > 0) {
      footerData = footerItems[0].metadata;
    }
  } catch (e) {
    console.error('Failed to load dynamic content for landing page', e);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: {
          '@type': 'ImageObject',
          url: `${siteConfig.url}/icon.png`,
        },
        sameAs: Object.values(siteConfig.links),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        publisher: {
          '@id': `${siteConfig.url}/#organization`,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden selection:bg-[#FF6B00] selection:text-white">
      <RootAuthRedirect />
      <Script
        id="json-ld-homepage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* Section 1: Hero with 3D Canvas & Perspective Tilt Cards */}
        <Hero />

        {/* Section 2: Service Discovery with Active & Coming Soon Statuses */}
        <ServiceDiscovery />

        {/* Section 3: Interactive Apple-style 3D Smartphone Printing Workflow */}
        <ProductShowcase />

        {/* Section 4: 4 Simple Steps to Classroom Desk Delivery */}
        <HowItWorks />

        {/* Section 5: The Smarter Choice - Traditional vs BLINTZY */}
        <ComparisonTable />

        {/* Section 6: Unified Campus Ecosystem */}
        <CampusEcosystem />

        {/* Section 7: Key Features */}
        <Features />

        {/* Dynamic Statistics & Social Proof if present */}
        {statsData.length > 0 && <Statistics data={statsData} />}
        {testimonialsData.length > 0 && <Testimonials data={testimonialsData} />}

        {/* Section 8: Student FAQs */}
        <FAQ />

        {/* Section 9: About BLINTZY */}
        <About />

        {/* Section 10: High-Impact Call to Action */}
        <CTA />
      </main>
      <Footer
        socialLinks={status?.social_links}
        contactData={footerData}
        termsUrl={status?.terms_pdf_url}
        privacyUrl={status?.privacy_policy_pdf_url}
      />
    </div>
  );
}
