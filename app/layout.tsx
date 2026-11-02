import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { getProfile } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Root metadata, read from the live profile so editing it in the Studio also
 * updates the page title, description and social cards.
 *
 * Deliberately NOT marked `use cache`: a cached scope has to return
 * serialisable values, and `metadataBase` is a `URL` instance. `getProfile()`
 * is cached on its own (tagged `content:profile`), so this stays prerenderable
 * and the revalidation webhook still refreshes it.
 */
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `${profile.name} | ${profile.headline}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${profile.name}`,
    },
    description: profile.shortBio,
    applicationName: `${profile.name} Portfolio`,
    authors: [{ name: profile.name, url: SITE_URL }],
    creator: profile.name,
    keywords: [
      profile.name,
      profile.headline,
      "React Native developer",
      "mobile app developer",
      "frontend developer",
      "React Native",
      "Expo",
      "Next.js",
      "iOS app developer",
      "Android app developer",
      profile.location,
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: profile.name,
      title,
      description: profile.shortBio,
      url: SITE_URL,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: profile.shortBio,
      creator: "@GovindaTimsina7",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121016" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
