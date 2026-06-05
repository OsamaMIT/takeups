import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Takeups",
  description: "Your opinion has been assigned.",
  metadataBase: new URL("https://takeups.example"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#05060A",
  colorScheme: "dark"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
