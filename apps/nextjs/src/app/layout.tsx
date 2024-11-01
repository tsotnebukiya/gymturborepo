import type { Metadata, Viewport } from "next";

import "~/app/globals.css";

export const metadata: Metadata = {
  title: "",
  description: "",
  openGraph: {
    title: "",
    description: "",
    url: "",
    siteName: "",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body></body>
    </html>
  );
}
