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

import { workerClient } from '@/lib/api/workerClient';
import { publicContent } from '@/config/publicContent';

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
    console.error("Failed to load dynamic content for landing page", e);
  }

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
        <div id="interactive-demo">
          <InteractiveDemo />
        </div>
        <Features />
        <ProductShowcase />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <ComparisonTable />
        <CampusEcosystem />
        <UseCases />
        <Statistics data={statsData.length > 0 ? statsData : undefined} />
        <Testimonials data={testimonialsData.length > 0 ? testimonialsData : undefined} />
        <FAQ />
        <About />
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
