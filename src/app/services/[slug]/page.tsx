import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { getPublicPlatformStatus } from '@/lib/api/server/platform';
import { constructMetadata, siteConfig } from '@/lib/seo/metadata';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Script from 'next/script';

interface ServiceData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  intro: string;
  forWhom: string;
  howItWorks: string[];
  options: string[];
  ctaText: string;
  ctaUrl: string;
}

const servicesData: Record<string, ServiceData> = {
  'academic-manual-printing': {
    slug: 'academic-manual-printing',
    title: 'Academic Manual Printing',
    metaTitle: 'Academic Manual Printing for Students | BLINTZY',
    metaDescription: 'Easily order and print academic semester manuals for your branch. Delivered directly to your campus without waiting in line.',
    intro: 'Start your semester right. BLINTZY offers pre-compiled academic manuals for your specific college, branch, and semester.',
    forWhom: 'College students who need fast, accurate, and high-quality printed lab manuals or study materials for the semester.',
    howItWorks: [
      'Select your college, branch, and semester in the app.',
      'Browse available academic manuals prepared for your curriculum.',
      'Place your order with a single click.',
      'Pick up your freshly printed manuals on campus.'
    ],
    options: ['Spiral Binding', 'Soft Cover Binding', 'Double-sided printing to save paper'],
    ctaText: 'Browse Manuals',
    ctaUrl: '/app/services/manuals'
  },
  'custom-pdf-printing': {
    slug: 'custom-pdf-printing',
    title: 'Custom PDF Printing',
    metaTitle: 'Custom PDF Printing & Document Delivery | BLINTZY',
    metaDescription: 'Upload any PDF document for high-quality custom printing. Choose your options and pick it up on campus easily.',
    intro: 'Need assignments, notes, or project reports printed? Upload your own PDF files and get them printed exactly the way you want.',
    forWhom: 'Students and faculty who need customized printing for assignments, personal notes, projects, and research papers.',
    howItWorks: [
      'Upload your PDF file directly through the BLINTZY app.',
      'Choose black & white or color, single or double-sided printing.',
      'Select binding options if needed.',
      'Pick up the finished document at your campus location.'
    ],
    options: ['Black & White or Full Color', 'Single-sided or Double-sided', 'A4 Standard Size', 'Spiral Binding'],
    ctaText: 'Upload a PDF',
    ctaUrl: '/app/services/upload'
  },
  'hall-ticket-printing': {
    slug: 'hall-ticket-printing',
    title: 'Hall Ticket Printing',
    metaTitle: 'Hall Ticket Printing for Students | BLINTZY',
    metaDescription: 'Print your university hall tickets instantly. Fast, secure, and delivered right to your campus so you are ready for exams.',
    intro: 'Exams are stressful enough without worrying about where to print your hall ticket. BLINTZY makes hall ticket printing fast and reliable.',
    forWhom: 'Students preparing for upcoming university or college examinations who need a physical copy of their hall ticket.',
    howItWorks: [
      'Upload your official hall ticket PDF.',
      'Our system automatically formats it for standard exam requirements.',
      'Your hall ticket is printed with high-quality ink for clear barcodes and photos.',
      'Pick it up on campus before your exam.'
    ],
    options: ['High-Quality Black & White', 'Standard A4', 'Quick Turnaround'],
    ctaText: 'Print Hall Ticket',
    ctaUrl: '/app/services/hall-tickets'
  },
  'campus-document-delivery': {
    slug: 'campus-document-delivery',
    title: 'Campus Document Delivery',
    metaTitle: 'Campus Document Delivery | BLINTZY',
    metaDescription: 'Skip the Xerox shop line. Order your prints online and collect them conveniently through our campus delivery system.',
    intro: 'Say goodbye to waiting in long lines at the campus print shop. With BLINTZY, your documents are printed and packaged for easy campus pickup.',
    forWhom: 'Busy students who value their time and want a smarter way to handle their daily printing needs without the hassle.',
    howItWorks: [
      'Submit your print jobs online from anywhere.',
      'We process and print your documents at our partner facilities.',
      'Your prints are securely packaged with your order ID.',
      'Collect your package from the designated campus pickup location.'
    ],
    options: ['Secure Packaging', 'Fast Processing', 'No Waiting in Line'],
    ctaText: 'Start Printing',
    ctaUrl: '/app/login'
  }
};

export function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = servicesData[params.slug];
  if (!service) return {};

  return constructMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    canonicalPath: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = servicesData[params.slug];
  
  if (!service) {
    notFound();
  }

  const status = await getPublicPlatformStatus();
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.url
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 selection:bg-orange-500 selection:text-white">
      <Script
        id={`json-ld-service-${service.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              {service.title}
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {service.intro}
            </p>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Who is this for?</h2>
                <p className="text-gray-600 leading-relaxed">{service.forWhom}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Options</h2>
                <ul className="space-y-3 text-gray-600">
                  {service.options.map((opt, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-orange-500 shrink-0" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-8 mb-12 border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How it works</h2>
              <ol className="space-y-4">
                {service.howItWorks.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 pt-1 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-12 pt-8 border-t border-gray-100">
              <Link 
                href={service.ctaUrl}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 text-base font-bold text-white shadow-[0_8px_30px_rgba(249,115,22,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(249,115,22,0.4)] active:scale-95 w-full sm:w-auto"
              >
                {service.ctaText}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer socialLinks={status?.social_links} />
    </div>
  );
}
