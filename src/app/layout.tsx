import type { Metadata } from "next";
import { AppProvider } from "@/providers/AppProvider";
import { BootstrapGuard } from "@/features/bootstrap/components/BootstrapGuard";
import { constructMetadata, siteConfig } from "@/lib/seo/metadata";

import "../styles/globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`, // Assuming this exists or will be added
  };

  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col"><AppProvider><BootstrapGuard>{children}</BootstrapGuard></AppProvider></body>
    </html>
  );
}
