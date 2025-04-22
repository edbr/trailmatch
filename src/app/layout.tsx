import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script"
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find your next trail",
  description: "Adventure at your fingertips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="qhfqhpiGgeFz0l6TUBU16FEg4Sn-Kf_4XfvCnnJPYvc" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
      <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-LFTNP2NZTD`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LFTNP2NZTD');
          `}
        </Script>

        {children}
        <Analytics /> {/* ✅ Add this here */}
      </body>
    </html>
  );
}
