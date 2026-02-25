import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { APP_CONFIG } from "@/lib/env";

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppinsDisplay = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: "InfinityFX administration dashboard",
  icons: {
    icon: "/icon-logo.png",
    shortcut: "/icon-logo.png",
    apple: "/icon-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${poppinsDisplay.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
