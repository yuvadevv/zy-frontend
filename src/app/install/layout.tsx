import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Install BLINTZY App | Campus Printing & Academic Documents",
  description:
    "Install BLINTZY on your Android, iOS, or desktop device for fast, one-tap access to campus printing, Xerox, academic manuals, and hall tickets.",
  canonicalPath: "/install",
});

export default function InstallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
