import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Bermondish | Your Bermondsey Restaurant Guide",
  description: "Discover the finest dining experiences, hidden gems, and local favorites in the heart of London SE1. Curated by Bermondsey residents.",
  openGraph: {
    title: "Bermondish | Bermondsey Restaurant Directory",
    description: "Find your next favorite meal in London's SE1.",
    url: "https://bermondish.com",
    siteName: "Bermondish",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFZSoJiaO1okJtUrDcY_OKfyjtDsB5GQYoc86XKxsP2qnadvLzmCxycS8tYI-vvaIlHCSqxJL77YAY-Act5_lAVWQZ45sT-fQIMgY64twwvyU0xjmD_GGnsViMhOir6ZTTvAZxRNkg3D9NTMz2FJWOVe4MfrDd3wnOTohzaRu-EviqnsTblgzVVxAPIPa7oYMLOhjEIjiJ560lmJYcroRKId1OyrqU8TmCUW0L3YOV6tNI2c4V1pUhDzwlb9FS8m3nZBtIWjoUl2iM",
        width: 1200,
        height: 630,
        alt: "Bermondish - Bermondsey Restaurant Guide",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bermondish | Bermondsey Restaurant Directory",
    description: "Discover the best food and drink in London SE1.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAFZSoJiaO1okJtUrDcY_OKfyjtDsB5GQYoc86XKxsP2qnadvLzmCxycS8tYI-vvaIlHCSqxJL77YAY-Act5_lAVWQZ45sT-fQIMgY64twwvyU0xjmD_GGnsViMhOir6ZTTvAZxRNkg3D9NTMz2FJWOVe4MfrDd3wnOTohzaRu-EviqnsTblgzVVxAPIPa7oYMLOhjEIjiJ560lmJYcroRKId1OyrqU8TmCUW0L3YOV6tNI2c4V1pUhDzwlb9FS8m3nZBtIWjoUl2iM"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${workSans.variable} font-sans antialiased bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
