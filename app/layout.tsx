import type { Metadata } from "next";
import { motionPreferenceScript } from "@/components/motion-preference";
import "lenis/dist/lenis.css";
import "./globals.css";

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
        url: "/images/socratic-laptop-hero.webp",
        width: 1536,
        height: 1024,
        alt: "Original SocratesCode artwork: Socrates working on a laptop",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionPreferenceScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
