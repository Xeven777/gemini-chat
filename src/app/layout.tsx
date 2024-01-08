import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gemini PRO chatbot",
  description: "Chat with Gemini Pro AI",
  manifest: "/manifest.json",
  metadataBase: new URL("https://gemini-chatbot.netlify.app/"),
  openGraph: {
    type: "website",
    url: "https://gemini-chatbot.netlify.app/",
    title: "GeminiPRO Chat AI",

    description: "Chat with Gemini Pro AI",
    images: [
      {
        url: "/android-chrome-192x192.png",
        width: 192,
        height: 192,
        alt: "GeminiPRO Chat AI",
      },
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "GeminiPRO Chat AI",
      },
    ],
  },
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};
export const viewport: Viewport = {
  themeColor: "#5261ea",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
