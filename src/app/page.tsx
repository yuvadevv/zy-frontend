import { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { Hero } from '@/components/public/Hero';
import { ProblemSection } from '@/components/public/ProblemSection';
import { SolutionFlow } from '@/components/public/SolutionFlow';
import { InteractiveDemo } from '@/components/public/InteractiveDemo';
import { Features } from '@/components/public/Features';
import { ProductShowcase } from '@/components/public/ProductShowcase';
import { HowItWorks } from '@/components/public/HowItWorks';
import { ComparisonTable } from '@/components/public/ComparisonTable';
import { CampusEcosystem } from '@/components/public/CampusEcosystem';
import { UseCases } from '@/components/public/UseCases';
import { Statistics } from '@/components/public/Statistics';
import { Testimonials } from '@/components/public/Testimonials';
import { FAQ } from '@/components/public/FAQ';
import { About } from '@/components/public/About';
import { CTA } from '@/components/public/CTA';
import { Footer } from '@/components/public/Footer';
import { getPublicPlatformStatus } from '@/lib/api/server/platform';

import { constructMetadata, siteConfig } from '@/lib/seo/metadata';
import Script from 'next/script';

export const metadata: Metadata = constructMetadata({
  canonicalPath: '',
});

export default async function LandingPage() {
  const status = await getPublicPlatformStatus();
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        "name": siteConfig.name,
        "url": siteConfig.url,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteConfig.url}/icon.png`
        },
        "sameAs": Object.values(siteConfig.links)
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        "url": siteConfig.url,
        "name": siteConfig.name,
        "publisher": {
          "@id": `${siteConfig.url}/#organization`
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden selection:bg-orange-500 selection:text-white">
      <Script
        id="json-ld-homepage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionFlow />
        <InteractiveDemo />
        <Features />
        <ProductShowcase />
        <HowItWorks />
        <ComparisonTable />
        <CampusEcosystem />
        <UseCases />
        <Statistics />
        <Testimonials />
        <FAQ />
        <About />
        <CTA />
      </main>
      <Footer socialLinks={status?.social_links} />
    </div>
  );
}
