import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BhoomiVeda - AI Powered Smart Farming",
  description:
    "BhoomiVeda empowers Indian farmers with AI-powered crop recommendations, weather insights, soil analysis, and market intelligence for smarter farming decisions.",
  keywords: [
    "BhoomiVeda",
    "smart farming",
    "AI agriculture",
    "crop recommendation",
    "Indian farming",
    "Kisan",
  ],
  authors: [{ name: "BhoomiVeda Team" }],
  icons: {
    icon: "/bhoomi-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${poppins.variable} font-[family-name:var(--font-poppins)] antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
