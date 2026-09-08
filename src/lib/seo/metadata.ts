import type { Metadata } from "next";

const defaultUrl = "https://www.blintzy.com";

export const siteConfig = {
  name: "BLINTZY",
  description: "BLINTZY is a smart campus printing and academic document service that helps students upload, print, access manuals, obtain hall tickets, and receive documents conveniently.",
  url: defaultUrl,
  ogImage: `${defaultUrl}/images/og-image.jpg`, // Assuming we place a good image here
  links: {
    twitter: "https://twitter.com/blintzy", // Replace with real if exists
    linkedin: "https://www.linkedin.com/company/blintzy", // Replace with real if exists
  },
};

type ConstructMetadataProps = {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  canonicalPath?: string;
};

export function constructMetadata({
  title = `${siteConfig.name} | Campus Printing & Academic Documents`,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
  canonicalPath = "",
}: ConstructMetadataProps = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${canonicalPath}`,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${title}`,
        },
      ],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@blintzy", // Only use if appropriate
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `${siteConfig.url}${canonicalPath}`,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
