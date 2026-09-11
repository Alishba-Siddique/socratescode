import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./sections.css";
import "./hero.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "SocratesCode — Independent thinking.",
  description:
    "An open-source learning lab for programming logic. Build real understanding through Socratic questions, visual code tracing, and the PRIMM framework.",
  applicationName: "SocratesCode",
  openGraph: {
    title: "SocratesCode — Independent thinking.",
    description:
      "Less autocomplete. More understanding. A learning lab for the independently minded developer.",
    type: "website",
    images: [
      {
        url: "/images/socratic-coder-v2.webp",
        width: 1254,
        height: 1254,
        alt: "Original SocratesCode artwork: Socrates working on a laptop",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-motion="on" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
